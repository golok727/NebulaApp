// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use dirs::data_dir;
use std::fs;
use std::path::PathBuf;

fn main() {
    initialize_app();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}

fn make_directories(paths: Vec<String>) -> Result<PathBuf, String> {
    if let Some(mut app_data_dir) = data_dir() {
        for path in paths {
            app_data_dir.push(path);
        }
        if let Err(err) = fs::create_dir_all(&app_data_dir) {
            return Err(format!("Error creating directories: {}", err));
        }

        Ok(app_data_dir)
    } else {
        return Err("Failed Retrieving the data dir directory".to_string());
    }
}
fn initialize_app() {
    if let Err(err) = make_directories(
        vec!["RadhikaSoftwares", "Nebula", "data"]
            .into_iter()
            .map(String::from)
            .collect(),
    ) {
        eprintln!("{}", err);
    }

    if let Err(err) = make_directories(
        vec!["RadhikaSoftwares", "Nebula", "assets"]
            .into_iter()
            .map(String::from)
            .collect(),
    ) {
        eprintln!("{}", err);
    }
}
