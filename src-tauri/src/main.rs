// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod utils;
mod handlers {
    pub mod images;
    pub mod notebook;
    pub mod pages;
}
use handlers::notebook::{create_notebook, get_notebooks};
use utils::initialize_app;

fn main() {
    initialize_app();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_notebook, get_notebooks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
