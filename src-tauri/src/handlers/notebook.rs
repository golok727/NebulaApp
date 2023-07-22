use crate::utils;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::{fs, io::Read, path::PathBuf};
use uuid::Uuid;

const CURRENT_VERSION: i32 = 1;
#[derive(Serialize, Deserialize, Clone)]
pub struct Notebook {
    __version__: i32,
    _id_: String,
    notebook_name: String,
    created_at: String,
}
impl Notebook {
    // Create a new instance of Notebook with the given notebook_name
    pub fn new(notebook_name: String) -> Self {
        Notebook {
            __version__: CURRENT_VERSION,
            _id_: Uuid::new_v4().to_string(),
            notebook_name,
            created_at: Utc::now().to_rfc3339(),
        }
    }
}

fn write_notebook_metadata(
    notebook_meta_data_path: &PathBuf,
    data: &Notebook,
) -> Result<(), String> {
    let serialized =
        bincode::serialize(&data).map_err(|err| format!("Error serializing data {}", err))?;

    fs::write(&notebook_meta_data_path, &serialized)
        .map_err(|err| format!("Failed to ass notebook metadata to notebooks.json: {}", err))
}

#[tauri::command]
pub fn create_notebook(notebook_name: String) -> Result<Notebook, String> {
    let notebook_dir = utils::get_notebook_data_dir();

    if notebook_dir.exists() {
        let new_notebook = Notebook::new(notebook_name);
        let notebook_path = notebook_dir.join(&new_notebook._id_);
        fs::create_dir(&notebook_path)
            .map_err(|err| format!("Failed to create a notebook directory: {}", err))?;

        let notebook_meta_data_path = notebook_path.join("__metadata__.nb");
        write_notebook_metadata(&notebook_meta_data_path, &new_notebook)?;

        Ok(new_notebook)
    } else {
        Err("Notebook data directory does not exist.".to_string())
    }
}

fn deserialize_notebook_metadata(file_path: &PathBuf) -> Result<Notebook, String> {
    // Open the file
    let mut file =
        fs::File::open(file_path).map_err(|err| format!("Error opening file: {}", err))?;

    // Read the file into a buffer
    let mut data_bytes = Vec::new();
    file.read_to_end(&mut data_bytes)
        .map_err(|err| format!("Error reading file: {}", err))?;

    // Deserialize the buffer into Notebook

    match bincode::deserialize(&data_bytes) {
        Ok(data) => Ok(data),
        Err(err) => Err(format!("Error deserializing file\n\n Error = {}", err)),
    }
}

#[tauri::command]
pub fn get_notebooks() -> Result<Vec<Notebook>, String> {
    let mut notebooks: Vec<Notebook> = Vec::new();

    let notebook_dir = utils::get_notebook_data_dir();
    if notebook_dir.exists() {
        let entries = fs::read_dir(notebook_dir)
            .map_err(|err| format!("Error Reading notebooks:\n\n Error \n{}", err))?;

        for entry in entries {
            let entry = entry.map_err(|_| "Error reading notebook".to_string())?;
            let path = entry.path();
            if path.is_dir() {
                let meta_data_file = path.join("__metadata__.nb");
                if meta_data_file.exists() {
                    let notebook = deserialize_notebook_metadata(&meta_data_file)?;
                    notebooks.push(notebook);
                }
            }
        }
        Ok(notebooks)
    } else {
        Err("Error getting notebooks".to_string())
    }
}

#[derive(Serialize)]
pub struct CreateNotebookResponse {
    _id_: String,
    notebook_name: String,
    created_at: String,
}

#[derive(Serialize)]
pub struct NotebookResponse {
    notebook: CreateNotebookResponse,
}

#[tauri::command]
pub fn load_notebook(notebook_id: String) -> Result<NotebookResponse, ErrorResponse> {
    let notebooks_dir = utils::get_notebook_data_dir();

    let notebook_dir = notebooks_dir.join(notebook_id);
    println!("{}", notebook_dir.display());
    if notebook_dir.exists() {
        // Get the Notebook MetaData
        let meta_data = deserialize_notebook_metadata(&notebook_dir.join("__metadata__.nb"))
            .map_err(|err| ErrorResponse {
                status: 500,
                message: err.clone(),
            })?;

        // Make The Response
        let response = NotebookResponse {
            notebook: CreateNotebookResponse {
                _id_: meta_data._id_,
                notebook_name: meta_data.notebook_name,
                created_at: meta_data.created_at,
            },
        };
        Ok(response)
    } else {
        Err(ErrorResponse {
            status: 404,
            message: "Notebook Not Found".to_string(),
        })
    }
}

#[derive(Serialize)]
pub struct ErrorResponse {
    status: i32,
    message: String,
}
