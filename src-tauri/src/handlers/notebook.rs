use crate::state::AppState;
use crate::utils::status::error::{ErrorCode, ErrorResponse};
use crate::{
    nebula::NebulaNotebookFile::{NebulaNotebook, PageSimple},
    utils::Application::{count_files_with_extension, get_notebook_data_dir},
};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::{
    fs,
    io::{Read, Write},
};
use tauri::State;

#[derive(Clone, Serialize, Deserialize)]
pub struct NotebookMetadata {
    __id: String,
    name: String,
    thumbnail: Option<String>,
    created_at: String,
}
#[derive(Clone, Serialize, Deserialize)]
pub struct MetaDataFile {
    notebooks: Vec<NotebookMetadata>,
}

pub fn load_notebooks_metadata() -> Result<MetaDataFile, ErrorResponse> {
    let notebooks_dir = get_notebook_data_dir();
    let notebooks_metadata_json = notebooks_dir.join("meta_data.json");

    match notebooks_metadata_json.exists() {
        true => {
            let mut file = fs::File::open(&notebooks_metadata_json).map_err(|error| {
                ErrorResponse::new(
                    ErrorCode::FileNotFound,
                    format!("Error Opening Metadata File {}", error),
                )
            })?;

            let mut json = String::new();

            file.read_to_string(&mut json).map_err(|error| {
                ErrorResponse::new(ErrorCode::IoError, format!("Error Reading File {}", error))
            })?;

            let data: MetaDataFile = serde_json::from_str(&json).map_err(|error| {
                ErrorResponse::new(
                    ErrorCode::DeserializationError,
                    format!("Error deserializing metadata file {}", error),
                )
            })?;

            Ok(data)
        }
        _ => {
            let nb_files_count = count_files_with_extension(&notebooks_dir, "nb");
            if nb_files_count > 0 {
                Err(ErrorResponse::new(ErrorCode::NotebookMetadataNotFound, "No Metadata file available. May be it is deleted or corrupted please try auto recovery".to_string()))
            } else {
                Ok(MetaDataFile {
                    notebooks: Vec::new(),
                })
            }
        }
    }
}
pub fn put_metadata(data: &MetaDataFile) -> Result<(), ErrorResponse> {
    let notebooks_dir = get_notebook_data_dir();
    let notebooks_metadata_json = notebooks_dir.join("meta_data.json");

    let json_string = serde_json::to_string(&data).map_err(|error| {
        ErrorResponse::new(
            ErrorCode::SerializationError,
            format!("Error Serializing Metadata {}", error),
        )
    })?;
    let mut json_file = fs::File::create(notebooks_metadata_json).map_err(|error| {
        ErrorResponse::new(ErrorCode::IoError, format!("Error Creating File {}", error))
    })?;
    json_file
        .write_all(json_string.as_bytes())
        .map_err(|error| {
            ErrorResponse::new(
                ErrorCode::IoError,
                format!("Error Saving to file: {}", error),
            )
        })?;

    Ok(())
}

pub fn add_notebook_to_metadata_file(
    metadata: &NotebookMetadata,
) -> Result<MetaDataFile, ErrorResponse> {
    let notebooks_dir = get_notebook_data_dir();
    let notebooks_metadata_json = notebooks_dir.join("meta_data.json");

    let existing_data = if notebooks_metadata_json.exists() {
        let data = load_notebooks_metadata()?;
        Ok(data)
    } else {
        let new_meta_data_file_content = MetaDataFile {
            notebooks: Vec::new(),
        };
        Ok(new_meta_data_file_content)
    };

    match existing_data {
        Ok(mut data) => {
            data.notebooks.push(metadata.clone());
            put_metadata(&data)?;
            Ok(data)
        }
        Err(err) => err,
    }
}
#[derive(Serialize, Deserialize)]
pub struct CreateNotebookResponse {
    notebook: NebulaNotebook,
}
#[tauri::command]
pub fn create_nebula_notebook(
    notebook_name: String,
) -> Result<CreateNotebookResponse, ErrorResponse> {
    let new_notebook = NebulaNotebook::new(notebook_name);
    let meta_data = NotebookMetadata {
        __id: new_notebook.__id.clone(),
        name: new_notebook.name.clone(),
        thumbnail: new_notebook.thumbnail.clone(),
        created_at: new_notebook.created_at.clone(),
    };

    match new_notebook.save_to_file() {
        Ok(()) => {
            let res = CreateNotebookResponse {
                notebook: new_notebook,
            };
            add_notebook_to_metadata_file(&meta_data)?;
            Ok(res)
        }
        Err(error) => Err(error),
    }
}
// Load Notebooks at startup
#[tauri::command]
pub fn load_nebula_notebooks() -> Result<MetaDataFile, ErrorResponse> {
    let res = load_notebooks_metadata()?;
    Ok(res)
}

#[derive(Serialize, Deserialize)]
pub struct NotebookResponse {
    pub __id: String,
    pub name: String,
    pub last_accessed_at: String,
    pub created_at: String,
    assets: Vec<String>,
    pub pages: Vec<PageSimple>,
    pub thumbnail: Option<String>,
    pub description: Option<String>,
    pub author: Option<String>,
}

impl NotebookResponse {
    fn new(notebook: &NebulaNotebook, pages_simple: Vec<PageSimple>) -> Self {
        NotebookResponse {
            __id: notebook.__id.clone(),
            name: notebook.name.clone(),
            last_accessed_at: notebook.last_accessed_at.clone(),
            created_at: notebook.created_at.clone(),
            assets: notebook.assets.clone(),
            pages: pages_simple,
            thumbnail: notebook.thumbnail.clone(),
            description: notebook.description.clone(),
            author: notebook.author.clone(),
        }
    }
}

#[tauri::command]
pub fn load_nebula_notebook(
    state: State<'_, Arc<Mutex<AppState>>>,
    notebook_id: String,
) -> Result<NotebookResponse, ErrorResponse> {
    let mut state = state.lock().unwrap();
    let notebooks_dir = get_notebook_data_dir();
    let file_path = notebooks_dir.join(notebook_id + ".nb");

    let notebook = NebulaNotebook::load_from_file(&file_path)?;
    state.set_notebook(notebook);
    state.use_notebook(|notebook| {
        let simple_pages = notebook.get_simple_pages();
        let response = NotebookResponse::new(notebook, simple_pages);
        Ok(response)
    })?
}

#[tauri::command]
pub async fn save_notebook(
    state: State<'_, Arc<Mutex<AppState>>>,
) -> Result<String, ErrorResponse> {
    let mut state = state.lock().unwrap();

    state.use_notebook(|notebook| {
        notebook.last_accessed_at = chrono::Utc::now().to_rfc3339().to_string();
        notebook.save_to_file()?;
        Ok("Saved to file".to_string())
    })?
}
// #[tauri::command]
// pub fn unload_nebula_notebook() {}
