import fs from "fs";
import path from "path";
import ClientDocsViewer from "./ClientDocsViewer";

export default function CranfieldPage() {
  const dataDir = path.join(process.cwd(), "data", "Cranfield");
  let docs = [];

  try {
    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".txt"));
    docs = files.map((file) => {
      const content = fs.readFileSync(path.join(dataDir, file), "utf8");
      return { file, content };
    });
  } catch (e) {
    return (
      <div className="p-8 text-red-600">
        Error loading Cranfield dataset: {e.message}
      </div>
    );
  }

  return <ClientDocsViewer docs={docs} />;
}
