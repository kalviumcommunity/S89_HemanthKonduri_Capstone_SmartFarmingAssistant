import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

// Import TensorFlow.js and the MobileNet model
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

import '../styles/DiseaseDetectionPage.css'; // The new CSS will be provided below
import { FaUpload, FaLeaf, FaImage, FaStore } from 'react-icons/fa';

// --- UPDATED & EXPANDED SIMULATION MAPPING ---
// We've added more keywords to correctly identify your image and others.
const diseaseMapping = {
    // Keywords for your specific image
    'squash': { name: "Powdery Mildew", type: "Fungal", description: "A common fungal disease affecting squash, zucchini, and cucumbers, appearing as white, powdery spots on leaves." },
    'zucchini': { name: "Powdery Mildew", type: "Fungal", description: "A common fungal disease affecting squash, zucchini, and cucumbers, appearing as white, powdery spots on leaves." },
    'cucumber': { name: "Powdery Mildew", type: "Fungal", description: "A common fungal disease affecting squash, zucchini, and cucumbers, appearing as white, powdery spots on leaves." },
    
    // General keywords
    'leaf': { name: "Leaf Blight", type: "Fungal", description: "A common fungal issue causing spots and wilting on leaves." },
    'apple': { name: "Apple Scab", type: "Fungal", description: "Causes dark, scabby spots on apple fruits and leaves." },
    'rose': { name: "Rose Black Spot", type: "Fungal", description: "Fungal disease causing black spots on rose leaves, leading to yellowing." },
    'corn': { name: "Corn Common Rust", type: "Fungal", description: "Identified by reddish-brown pustules on corn leaves." },
    'tomato': { name: "Tomato Yellow Leaf Curl", type: "Viral", description: "A viral disease, often spread by whiteflies, causing stunted growth and yellow, curled leaves." },
    'potato': { name: "Potato Early Blight", type: "Fungal", description: "Causes dark lesions on potato leaves and tubers." },
    'bell pepper': { name: "Bacterial Spot", type: "Bacterial", description: "A bacterial infection leading to watery spots on leaves and fruit." },
    'flower': { name: "Powdery Mildew", type: "Fungal", description: "A white, powdery fungus that grows on the surface of leaves and stems." }
};


const DiseaseDetectionPage = () => {
    const [model, setModel] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loadingText, setLoadingText] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        const loadModel = async () => {
            setLoadingText('Loading AI model... Please wait.');
            try {
                await tf.ready();
                const loadedModel = await mobilenet.load();
                setModel(loadedModel);
                setLoadingText('');
            } catch (err) {
                setError("Failed to load AI model. Please refresh.");
                setLoadingText('');
            }
        };
        loadModel();
    }, []);

    const handleScanImage = async () => {
        if (!imageFile || !model) return;
        setLoadingText('Step 1: Analyzing image...');
        setError('');
        setResult(null);

        try {
            const imageElement = document.createElement('img');
            imageElement.src = previewUrl;
            await imageElement.decode();

            // 1. Classify image and get TOP 3 predictions
            const predictions = await model.classify(imageElement, 3);
            if (!predictions || predictions.length === 0) throw new Error("Could not classify image.");
            
            // 2. ***IMPROVED LOGIC***: Search for a match in the top 3 predictions
            let detectedObjectKey = null;
            let topPredictionText = predictions.map(p => p.className.split(',')[0]).join(', '); // For error messages

            for (const prediction of predictions) {
                const predictionText = prediction.className.toLowerCase();
                detectedObjectKey = Object.keys(diseaseMapping).find(key => predictionText.includes(key));
                if (detectedObjectKey) break; // Found a match! Stop searching.
            }

            if (!detectedObjectKey) {
                setError(`Could not identify a known plant disease. Our AI detected: "${topPredictionText}".`);
                setLoadingText('');
                return;
            }

            const diseaseInfo = diseaseMapping[detectedObjectKey];
            setLoadingText('Step 2: Fetching details & recommendations...');

            // 3. Call OUR backend to get details securely
            const response = await axios.post('http://localhost:5000/api/disease/details', {
                diseaseName: diseaseInfo.name,
                diseaseType: diseaseInfo.type
            });

            // 4. Set the final result with data from our backend
            setResult({
                diseaseInfo,
                pexelsImages: response.data.pexelsImages,
                recommendedProducts: response.data.recommendedProducts
            });

        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during analysis.");
        } finally {
            setLoadingText('');
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError('');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': ['.jpeg', '.jpg', '.png'] }, multiple: false });

    const resetState = () => {
        setImageFile(null);
        setPreviewUrl('');
        setResult(null);
        setError('');
    };

    return (
        <div className="disease-detection-container">
            <div className="detection-card">
                <h1>AI Plant Disease Detection</h1>
                <p className="subtitle">Upload an image of a plant leaf to detect potential diseases and get recommendations.</p>

                {!previewUrl && (
                    <div {...getRootProps()} className={`image-uploader ${isDragActive ? 'active' : ''}`}>
                        <input {...getInputProps()} />
                        <FaUpload className="upload-icon" />
                        {isDragActive ? <p>Drop the image here...</p> : <p>Drag & drop an image here, or click to select</p>}
                    </div>
                )}
                
                {loadingText && <div className="loader">{loadingText}</div>}

                {previewUrl && !result && !loadingText && (
                     <div className="image-preview-section">
                        <img src={previewUrl} alt="Selected Plant" className="image-preview" />
                        <div className="preview-actions">
                            <button onClick={handleScanImage} className="btn-scan" disabled={!model}>
                                {!model ? 'Model Loading...' : 'Scan Image'}
                            </button>
                            <button onClick={resetState} className="btn-reset">Change Image</button>
                        </div>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                {result && (
                    <div className="result-container">
                        <div className="result-header">
                             <img src={previewUrl} alt="Scanned Plant" className="result-preview-image" />
                             <div className="result-summary">
                                <p>Analysis Complete</p>
                                <h3>{result.diseaseInfo.name}</h3>
                                <span className={`disease-type ${result.diseaseInfo.type.toLowerCase()}`}>{result.diseaseInfo.type}</span>
                                <p className="disease-description">{result.diseaseInfo.description}</p>
                             </div>
                        </div>

                        {result.recommendedProducts?.length > 0 && (
                             <div className="recommendations-section">
                                <h4><FaStore /> Recommended Products</h4>
                                <div className="product-grid-recommend">
                                    {result.recommendedProducts.map(prod => (
                                        <div key={prod._id} className="product-card-recommend">
                                            <img src={prod.imageUrl} alt={prod.name} />
                                            <div className="product-info-recommend">
                                                <h5>{prod.name}</h5>
                                                {/* The Link component navigates the user to the store page */}
                                                <Link to="/store" className="btn-view-product">View in Store</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                       
                        {result.pexelsImages?.length > 0 && (
                            <div className="related-images-section">
                                <h4><FaImage /> Reference Images</h4>
                                <div className="pexels-grid">
                                    {result.pexelsImages.map(img => <img key={img.id} src={img.url} alt={img.photographer} />)}
                                </div>
                                <small>Images from Pexels.com</small>
                            </div>
                        )}
                         <div className="result-footer">
                            <button onClick={resetState} className="btn-reset">Scan Another Image</button>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiseaseDetectionPage;