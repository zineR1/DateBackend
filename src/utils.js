import multer from "multer";

//CONFIGURACION DE MULTER

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath = './public/imgs';
  
      // Obtener el tipo de archivo
      const fileType = getFileType(file);
  
      // Asignar la carpeta de destino según el tipo de archivo
      if (fileType === 'profile') {
        uploadPath = join(uploadPath, 'profiles');
      } else if (fileType === 'product') {
        uploadPath = join(uploadPath, 'products');
      } else if (fileType === 'document') {
        uploadPath = join(uploadPath, 'documents');
      }
  
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

  function getFileType(file) {
    // Verificar si es una imagen de perfil
    if (file.fieldname === 'profileImage') {
      return 'profile';
    }
  
    // Verificar si es una imagen de producto
    if (file.fieldname === 'productImage') {
      return 'product';
    }
  
    // Considerar cualquier otro archivo como documento
    return 'document';
  }
  
  export const uploader = multer({ storage });