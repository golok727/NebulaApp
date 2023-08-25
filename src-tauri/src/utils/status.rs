pub mod error {
    use serde::{Deserialize, Serialize};

    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub enum ErrorCode {
        NotFoundError,
        InternalError,
        SerializationError,
        DeserializationError,
        CreationError,
        WriteError,
        CorruptedFile,
        Unsupported,
        Unexpected,
        NotebookNotLoadedYet,
        NotebookMetadataNotFound,
        IoError,
        ClientError,
        FileNotFound,
    }
    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct ErrorResponse {
        pub code: ErrorCode,
        pub message: String,
    }
    impl ErrorResponse {
        pub fn new(code: ErrorCode, message: String) -> Self {
            Self { code, message }
        }

        pub fn from(code: ErrorCode, prefix: Option<&str>) -> ErrorResponse {
            match code {
                ErrorCode::NotFoundError => {
                    let message = match prefix {
                        Some(prefix) => format!("Error: {} not found!", prefix),
                        None => String::from("Error: Not Found"),
                    };
                    ErrorResponse::new(ErrorCode::NotFoundError, message)
                }
                ErrorCode::InternalError => {
                    let message = match prefix {
                        Some(prefix) => format!("Internal error: {}", prefix),
                        None => String::from("Internal error"),
                    };
                    ErrorResponse::new(ErrorCode::InternalError, message)
                }
                ErrorCode::SerializationError => {
                    let message = match prefix {
                        Some(prefix) => format!("Serialization error: {}", prefix),
                        None => String::from("Serialization error"),
                    };
                    ErrorResponse::new(ErrorCode::SerializationError, message)
                }
                ErrorCode::DeserializationError => {
                    let message = match prefix {
                        Some(prefix) => format!("Deserialization error: {}", prefix),
                        None => String::from("Deserialization error"),
                    };
                    ErrorResponse::new(ErrorCode::DeserializationError, message)
                }
                ErrorCode::CreationError => {
                    let message = match prefix {
                        Some(prefix) => format!("Creation error: {}", prefix),
                        None => String::from("Creation error"),
                    };
                    ErrorResponse::new(ErrorCode::CreationError, message)
                }
                ErrorCode::WriteError => {
                    let message = match prefix {
                        Some(prefix) => format!("Write error: {}", prefix),
                        None => String::from("Write error"),
                    };
                    ErrorResponse::new(ErrorCode::WriteError, message)
                }
                ErrorCode::CorruptedFile => {
                    let message = match prefix {
                        Some(prefix) => format!("Corrupted file: {}", prefix),
                        None => String::from("Corrupted file"),
                    };
                    ErrorResponse::new(ErrorCode::CorruptedFile, message)
                }
                ErrorCode::Unsupported => {
                    let message = match prefix {
                        Some(prefix) => format!("Unsupported error: {}", prefix),
                        None => String::from("Unsupported error"),
                    };
                    ErrorResponse::new(ErrorCode::Unsupported, message)
                }
                ErrorCode::Unexpected => {
                    let message = match prefix {
                        Some(prefix) => format!("Unexpected error: {}", prefix),
                        None => String::from("Unexpected error"),
                    };
                    ErrorResponse::new(ErrorCode::Unexpected, message)
                }
                ErrorCode::NotebookNotLoadedYet => {
                    let message = match prefix {
                        Some(prefix) => format!("Notebook not loaded yet: {}", prefix),
                        None => String::from("Notebook not loaded yet"),
                    };
                    ErrorResponse::new(ErrorCode::NotebookNotLoadedYet, message)
                }
                ErrorCode::NotebookMetadataNotFound => {
                    let message = match prefix {
                        Some(prefix) => format!("Notebook metadata not found: {}", prefix),
                        None => String::from("Notebook metadata not found"),
                    };
                    ErrorResponse::new(ErrorCode::NotebookMetadataNotFound, message)
                }
                ErrorCode::IoError => {
                    let message = match prefix {
                        Some(prefix) => format!("I/O error: {}", prefix),
                        None => String::from("I/O error"),
                    };
                    ErrorResponse::new(ErrorCode::IoError, message)
                }
                ErrorCode::ClientError => {
                    let message = match prefix {
                        Some(prefix) => format!("Client error: {}", prefix),
                        None => String::from("Client error"),
                    };
                    ErrorResponse::new(ErrorCode::ClientError, message)
                }
                ErrorCode::FileNotFound => {
                    let message = match prefix {
                        Some(prefix) => format!("File not found: {}", prefix),
                        None => String::from("File not found"),
                    };
                    ErrorResponse::new(ErrorCode::FileNotFound, message)
                }
            }
        }
    }
}
pub mod success {
    // For SuccessResponse
}
