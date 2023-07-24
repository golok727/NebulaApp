// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod nebula;
mod utils;

mod handlers {
    pub mod images;
    pub mod notebook;
    pub mod pages;
}
use handlers::notebook::{create_notebook, get_notebooks, load_notebook};
use utils::{get_notebook_data_dir, initialize_app};

fn main() {
    initialize_app();
    let notebook_dir = get_notebook_data_dir();
    //
    // let notebook = nebula::NebulaNotebookFile::NebulaNotebook::new("Radhey Krsna".to_string());

    // notebook
    //     .save_to_file()
    //     .unwrap_or_else(|err| println!("{}", err));

    let notebook_path = notebook_dir.join("2051f67f-8407-4787-b6e6-b8d5519776d9.nb");
    match nebula::NebulaNotebookFile::NebulaNotebook::load_from_file(&notebook_path) {
        Ok(loaded_notebook) => {
            println!("{:?}", loaded_notebook);
        }
        Err(err) => {
            println!("Error Loading Notebook: {}", err);
        }
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_notebook,
            get_notebooks,
            load_notebook
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
