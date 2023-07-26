use std::fs;
use std::path::PathBuf;
use tauri::api::path::config_dir;

pub fn make_directories(paths: &[&str]) -> Result<PathBuf, String> {
    let mut app_data_dir = config_dir().expect("Failed to get app data data directory");
    for path in paths {
        app_data_dir.push(PathBuf::from(path));
    }
    if let Err(err) = fs::create_dir_all(&app_data_dir) {
        return Err(format!("Error creating directories: {}", err));
    }

    Ok(app_data_dir)
}

pub fn get_notebook_data_dir() -> PathBuf {
    let mut notebooks_directory = config_dir().expect("Failed to get app data data directory");

    let paths: Vec<&str> = vec!["RadhikaSoftwares", "Nebula", "data", "notebooks"];
    for path in paths {
        notebooks_directory.push(PathBuf::from(path));
    }
    notebooks_directory
}

pub fn initialize_app() {
    let directories = vec!["RadhikaSoftwares", "Nebula", "data", "notebooks"];
    if let Err(err) = make_directories(&directories) {
        eprintln!("{}", err);
    }
}
