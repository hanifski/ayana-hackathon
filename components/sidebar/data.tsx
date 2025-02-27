import { use } from "react";

// This would typically be in a separate file
async function fetchData() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { message: "Data berhasil dimuat!" };
}

export default function DataComponent() {
  const data = use(fetchData());

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold">Data Component</h2>
      <p>{data.message}</p>
    </div>
  );
}
