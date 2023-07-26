// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod nebula;
mod state;
mod utils;

mod handlers;
use handlers::notebook;
use state::AppState;
use std::sync::{Arc, Mutex};
use utils::Application;
fn main() {
    Application::initialize_app();
    // let notebook_dir = get_notebook_data_dir();
    //
    // let notebook = nebula::NebulaNotebookFile::NebulaNotebook::new("Radhey Krsna".to_string());

    // notebook
    //     .save_to_file()
    //     .unwrap_or_else(|err| println!("{}", err));

    // let notebook_path = notebook_dir.join("2893e2b7-1643-4ab1-a21a-da7d9364629f.nb");

    // match nebula::NebulaNotebookFile::NebulaNotebook::load_from_file(&notebook_path) {
    //     Ok( loaded_notebook) => {
    //         // let pages_simple = loaded_notebook.get_simple_pages();
    //         // println!("{:#?}", &loaded_notebook);
    //         // println!("{:#?}", &pages_simple);
    //     }
    //     Err(err) => {
    //         println!("Error Loading Notebook: {}", err);
    //     }
    // }

    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(AppState::new())))
        .invoke_handler(tauri::generate_handler![
            notebook::create_nebula_notebook,
            notebook::load_nebula_notebooks,
            notebook::load_nebula_notebook,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
