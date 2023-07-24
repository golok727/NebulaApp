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
use handlers::nb::{create_nebula_notebook, load_nebula_notebooks};
use handlers::notebook::{create_notebook, get_notebooks, load_notebook};
use state::AppState;
use utils::initialize_app;

fn main() {
    initialize_app();
    // let notebook_dir = get_notebook_data_dir();
    //
    // let notebook = nebula::NebulaNotebookFile::NebulaNotebook::new("Radhey Krsna".to_string());

    // notebook
    //     .save_to_file()
    //     .unwrap_or_else(|err| println!("{}", err));

    // let notebook_path = notebook_dir.join("fb14a8c0-9090-4fbd-af4e-13d855c18d53.nb");
    // match nebula::NebulaNotebookFile::NebulaNotebook::load_from_file(&notebook_path) {
    //     Ok(loaded_notebook) => {
    //         println!("{:?}", loaded_notebook);
    //     }
    //     Err(err) => {
    //         println!("Error Loading Notebook: {}", err);
    //     }
    // }

    tauri::Builder::default()
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            create_notebook,
            get_notebooks,
            load_notebook,
            create_nebula_notebook,
            load_nebula_notebooks
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
