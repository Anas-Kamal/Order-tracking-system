import React, { useEffect, useState } from 'react'
import { UploadImage } from '../../constant/images';

const ImageUploader = ({ onImageUpload, src, imgWidth }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const inputId = `imageInput_${Math.random().toString(36).substr(2, 9)}`;

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedImage(URL.createObjectURL(file));
        onImageUpload(file);
      }
    };

    useEffect(()=>{
      if(src){
        setSelectedImage(src)
      }
    },[src])
  
    return (
      <div className='flex'>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
          // id="imageInput"
          id={inputId}

        />
        {/* <label htmlFor="imageInput" className="upload-button">
          Select Image
        </label> */}
        {/* {selectedImage && ( */}
          <div className="image-preview " >
            <label htmlFor={inputId}>
            <img className='cursor-pointer' width={imgWidth?imgWidth:35} src={selectedImage?selectedImage:UploadImage} alt="Uploaded" />
            </label>
          </div>
        {/* )} */}
      </div>
    );
  };
  
  export default ImageUploader;