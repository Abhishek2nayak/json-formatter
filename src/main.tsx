import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { BlogIndexPage } from './pages/BlogIndexPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { JsonFormatterPage } from './pages/tools/JsonFormatterPage'
import { JsonValidatorPage } from './pages/tools/JsonValidatorPage'
import { JsonMinifierPage } from './pages/tools/JsonMinifierPage'
import { JsonPrettifierPage } from './pages/tools/JsonPrettifierPage'
import { JsonToCsvPage } from './pages/tools/JsonToCsvPage'
import { JsonToXmlPage } from './pages/tools/JsonToXmlPage'
import { JsonToYamlPage } from './pages/tools/JsonToYamlPage'
import { JsonComparePage } from './pages/tools/JsonComparePage'
import { DiffCheckerPage } from './pages/tools/DiffCheckerPage'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<HomePage />} />

        {/* Full editor */}
        <Route path="/app" element={<App />} />

        {/* Tool pages */}
        <Route path="/json-formatter" element={<JsonFormatterPage />} />
        <Route path="/json-validator" element={<JsonValidatorPage />} />
        <Route path="/json-minifier" element={<JsonMinifierPage />} />
        <Route path="/json-prettifier" element={<JsonPrettifierPage />} />
        <Route path="/json-to-csv" element={<JsonToCsvPage />} />
        <Route path="/json-to-xml" element={<JsonToXmlPage />} />
        <Route path="/json-to-yaml" element={<JsonToYamlPage />} />
        <Route path="/json-compare" element={<JsonComparePage />} />
        <Route path="/diff-checker" element={<DiffCheckerPage />} />

        {/* Blog */}
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
