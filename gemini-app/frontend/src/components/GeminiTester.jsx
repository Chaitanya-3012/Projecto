import { useState } from "react";
import axios from "axios";

const GeminiTester = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-pro");
  const [responseTime, setResponseTime] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");
    const startTime = Date.now();

    try {
      const { data } = await axios.post("http://localhost:3001/api/generate", {
        prompt,
        model: selectedModel,
      });

      setResponse(data.generated_text);
      setResponseTime((Date.now() - startTime) / 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    alert("Copied to clipboard!");
  };
  const parseMarkdown = (content) => {
    const parts = content.split(/(`{3}[a-z]*\n[\s\S]*?\n`{3})/g);

    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith("```")) {
        const lines = part.split("\n");
        const language = lines[0].replace("```", "");
        const code = lines.slice(1, -1).join("\n");

        return (
          <pre
            key={index}
            className="my-4 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">{language}</span>
            </div>
            <code className="block font-mono text-sm">{code}</code>
          </pre>
        );
      }
      const inlineParts = part.split(/(`[^`]+`)/g);
      return (
        <div key={index} className="whitespace-pre-wrap">
          {inlineParts.map((inlinePart, i) => {
            if (inlinePart.startsWith("`") && inlinePart.endsWith("`")) {
              return (
                <code
                  key={i}
                  className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-sm"
                >
                  {inlinePart.slice(1, -1)}
                </code>
              );
            }
            return inlinePart;
          })}
        </div>
      );
    });
  };
  return (
    <div className="container">
      <h1>Gemini API Tester</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="model">Model:</label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="gemini-pro">Gemini Pro</option>
            <option value="gemini-pro-vision">Gemini Pro Vision</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="prompt">Prompt:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading || !prompt.trim()}>
            {loading ? "Generating..." : "Generate"}
          </button>
          {response && (
            <button type="button" onClick={copyToClipboard}>
              Copy Response
            </button>
          )}
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      {response && (
        <div className="response-section">
          <div className="response-header">
            <h3>Response</h3>
            {responseTime && (
              <span>Generated in {responseTime.toFixed(2)}s</span>
            )}
          </div>
          <div className="response-content">{parseMarkdown(response)}</div>
        </div>
      )}
    </div>
  );
};

export default GeminiTester;
