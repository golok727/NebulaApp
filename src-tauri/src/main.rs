// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod nebula;
mod state;
mod utils;

mod handlers {
    pub mod images;
    pub mod nb;
    pub mod notebook;
    pub mod pages;
}
use handlers::nb::{create_nebula_notebook, load_nebula_notebook, load_nebula_notebooks};
use handlers::notebook::{create_notebook, get_notebooks, load_notebook};
use state::AppState;
use std::sync::{Arc, Mutex};
use utils::{get_notebook_data_dir, initialize_app};
fn main() {
    initialize_app();
    let notebook_dir = get_notebook_data_dir();
    //
    // let notebook = nebula::NebulaNotebookFile::NebulaNotebook::new("Radhey Krsna".to_string());

    // notebook
    //     .save_to_file()
    //     .unwrap_or_else(|err| println!("{}", err));

    let notebook_path = notebook_dir.join("f9d9f375-c184-411d-a269-664354886aa3.nb");
    match nebula::NebulaNotebookFile::NebulaNotebook::load_from_file(&notebook_path) {
        Ok(loaded_notebook) => {
            let pages_simple = loaded_notebook.get_simple_pages();
            // println!("{:#?}", &loaded_notebook);
            println!("{:#?}", &pages_simple);
        }
        Err(err) => {
            println!("Error Loading Notebook: {}", err);
        }
    }

    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(AppState::new())))
        .invoke_handler(tauri::generate_handler![
            create_notebook,
            get_notebooks,
            load_notebook,
            create_nebula_notebook,
            load_nebula_notebooks,
            load_nebula_notebook,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
