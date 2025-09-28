// export const parseResume = async (file: File) => {
//   setParsing(true);
//   try {
//     const formData = new FormData();
//     formData.append("resume", file);

//     const res = await fetch(process.env.GEMINI_API!, {
//       method: "POST",
//       body: formData,
//     });

//     const data = await res.json(); // expects { name?, email?, phone? }
//     setParsedFields({
//       name: data.name || "",
//       email: data.email || "",
//       phone: data.phone || "",
//     });
//   } catch (err) {
//     console.error("Resume parsing failed:", err);
//   } finally {
//     setParsing(false);
//   }
// };
