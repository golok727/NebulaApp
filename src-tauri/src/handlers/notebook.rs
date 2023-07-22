use crate::utils;
use serde::{Deserialize, Serialize};
use std::{fs, io::Read, path::PathBuf};
use uuid::Uuid;
#[derive(Serialize, Deserialize, Clone)]
pub struct CreateNotebook {
    _id_: String,
    notebook_name: String,
}

fn write_notebook_metadata(
    notebook_meta_data_path: &PathBuf,
    data: &CreateNotebook,
) -> Result<(), String> {
    let serialized =
        bincode::serialize(&data).map_err(|err| format!("Error serializing data {}", err))?;

    fs::write(&notebook_meta_data_path, &serialized)
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

        let notebook_meta_data_path = notebook_path.join("__meta_data__.nb");
        write_notebook_metadata(&notebook_meta_data_path, &new_notebook)?;

        Ok(new_notebook)
    } else {
        Err("Notebook data directory does not exist.".to_string())
    }
}

fn deserialize_notebook_metadata(file_path: &PathBuf) -> Result<CreateNotebook, String> {
    // Open the file
    let mut file =
        fs::File::open(file_path).map_err(|err| format!("Error opening file: {}", err))?;

    // Read the file into a buffer
    let mut data_bytes = Vec::new();
    file.read_to_end(&mut data_bytes)
        .map_err(|err| format!("Error reading file: {}", err))?;

    // Deserialize the buffer into CreateNotebook
    match bincode::deserialize::<CreateNotebook>(&data_bytes) {
        Ok(data) => Ok(data),
        Err(err) => Err(format!("Error deserializing file\n\n Error = {}", err)),
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
                let meta_data_file = path.join("__meta_data__.nb");
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
