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
pub fn get_assets_dir() -> PathBuf {
    let mut assets_dir = config_dir().expect("Failed to get app data data directory");

    let paths: Vec<&str> = vec!["RadhikaSoftwares", "Nebula", "assets"];
    for path in paths {
        assets_dir.push(PathBuf::from(path));
    }
    assets_dir
}

pub fn initialize_app() {
    let directories = vec!["RadhikaSoftwares", "Nebula", "data", "notebooks"];
    if let Err(err) = make_directories(&directories) {
        eprintln!("{}", err);
    }
}

pub fn count_files_with_extension(directory: &PathBuf, extension: &str) -> usize {
    let mut count = 0;

    if directory.is_dir() {
        if let Ok(entries) = fs::read_dir(directory) {
            for entry in entries {
                if let Ok(entry) = entry {
                    if entry.path().is_file() {
                        if let Some(ext) = entry.path().extension() {
                            if ext == extension {
                                count += 1;
                            }
                        }
                    }
                }
            }
        }
    }

    count
}
