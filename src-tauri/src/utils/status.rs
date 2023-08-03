use serde::{Deserialize, Serialize};
pub mod error {
    use super::{Deserialize, Serialize};

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
        FileNotFound,
    }
    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct ErrorResponse {
        code: ErrorCode,
        message: String,
    }
    impl ErrorResponse {
        pub fn new(code: ErrorCode, message: String) -> Self {
            Self { code, message }
        }
    }
}
pub mod success {
    // For SuccessResponse
}
