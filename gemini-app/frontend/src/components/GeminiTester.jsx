import { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';

const GeminiTester = () => {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);  // Store multiple responses
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-pro');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const startTime = Date.now();

    try {
      const { data } = await axios.post('http://localhost:3001/api/generate', {
        prompt,
        model: selectedModel,
      });

      const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);
      const newResponse = {
        id: Date.now(),  // Unique ID for each response
        text: data.generated_text,
        prompt,
        responseTime,
      };

      setResponses([newResponse, ...responses]);  // Add new response at the top
      setPrompt('');  // Clear the prompt input
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
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
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      {/* Chat-style response list */}
      <div className="chat-container">
        {responses.map(({ id, text, prompt, responseTime }) => (
          <div key={id} className="chat-message">
            <div className="chat-prompt">
              <strong>Prompt:</strong> {prompt}
            </div>
            <div
              className="chat-response"
              dangerouslySetInnerHTML={{ __html: marked(text) }}
            />
            <div className="chat-info">
              <span>Generated in {responseTime}s</span>
              <button onClick={() => copyToClipboard(text)}>Copy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeminiTester;
