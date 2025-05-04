export const TINYMCE_API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

export const TINYMCE_CONFIG = {
  height: 400,
  menubar: false,
  plugins: ["advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table paste code help wordcount"],
  toolbar: "undo redo | formatselect | " + "bold italic backcolor | alignleft aligncenter " + "alignright alignjustify | bullist numlist outdent indent | " + "removeformat | help",
};
