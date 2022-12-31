import { pickFile } from "@jst_htet/file-picker";

export default function ImageUploader({ size = 150, url = "", onFilePicked }) {
  const handleOnClick = async () => {
    const [err, f] = await pickFile({
      accept: ".png,.jpg,.jpeg,.gif",
    });

    onFilePicked(f);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.includes("image")) {
      const fr = new FileReader();
      fr.readAsDataURL(files[0]);
      fr.addEventListener("load", () => {
        onFilePicked({
          dataurl: fr.result,
          file: files[0],
        });
      });
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className="flex justify-center items-center border-gray-300 rounded-xl cursor-pointer border-dashed bg-cover"
      onClick={handleOnClick}
      style={{
        borderWidth: 1,
        width: size,
        height: size,
        backgroundImage: `url("${url}")`,
      }}
    ></div>
  );
}
