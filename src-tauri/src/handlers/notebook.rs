use crate::utils;
use serde::{Deserialize, Serialize};
use serde_json;
use std::fs;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
pub struct CreateNotebook {
    _id_: String,
    notebook_name: String,
}

fn write_notebook_metadata(
    notebook_json: &std::path::PathBuf,
    data: &CreateNotebook,
) -> Result<(), String> {
    let updated_notebooks_json = serde_json::to_string(&data)
        .map_err(|err| format!("Failed to serialize updated notebooks data: {}", err))?;

    fs::write(&notebook_json, updated_notebooks_json)
        .map_err(|err| format!("Failed to ass notebook metadata to notebooks.json: {}", err))
}

#[tauri::command]
pub fn create_notebook(notebook_name: String) -> Result<CreateNotebook, String> {
    let notebook_dir = utils::get_notebook_data_dir();

    if notebook_dir.exists() {
        let uuid_v4 = Uuid::new_v4().to_string();
        let notebook_id = uuid_v4.clone();
        let notebook_path = notebook_dir.join(notebook_id);
        fs::create_dir(&notebook_path)
            .map_err(|err| format!("Failed to create a notebook directory: {}", err))?;

        let new_notebook = CreateNotebook {
            _id_: uuid_v4.clone(),
            notebook_name: notebook_name.clone(),
        };

        let notebook_json_path = notebook_path.join("__meta_data__.json");
        write_notebook_metadata(&notebook_json_path, &new_notebook)?;

        Ok(new_notebook)
    } else {
        Err("Notebook data directory does not exist.".to_string())
    }
}
#[tauri::command]
pub fn get_notebooks() -> Result<Vec<CreateNotebook>, String> {
    let mut notebooks: Vec<CreateNotebook> = Vec::new();

    let notebook_dir = utils::get_notebook_data_dir();
    if notebook_dir.exists() {
        let entries = fs::read_dir(notebook_dir)
            .map_err(|err| format!("Error Reading notebooks:\n\n Error \n{}", err))?;

        for entry in entries {
            let entry = entry.map_err(|_| "Error reading notebook".to_string())?;
            let path = entry.path();
            if path.is_dir() {
                let meta_data_file = path.join("__meta_data__.json");
                if meta_data_file.exists() {
                    let file_content = fs::read_to_string(meta_data_file).map_err(|err| {
                        format!("Error reading metadata for notebook\n\n Error: {}", err)
                    })?;
                    let notebook: CreateNotebook = serde_json::from_str(&file_content)
                        .map_err(|_| "Error converting data".to_string())?;
                    notebooks.push(notebook);
                }
            }
        }
        Ok(notebooks)
    } else {
        Err("Error getting notebooks".to_string())
    }
}
