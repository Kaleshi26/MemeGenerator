/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const Meme = ({ meme, setMeme }) => {
  const [form, setForm] = useState({
    template_id: meme.id,
    username: "RituGupta",
    password: "Ritu@123",
    boxes: [],
  });

  const [memeGenerated, setMemeGenerated] = useState(false);

  // New state: optional meme description
  const [description, setDescription] = useState(meme.description || "");

  // Save meme to history including description
  const saveMemeToHistory = (memeData) => {
    const savedMemes = JSON.parse(localStorage.getItem("memeHistory") || "[]");
    const newMeme = {
      id: Date.now(),
      url: memeData.url,
      template_name: meme.name || "Unknown Template",
      description: description,
      texts: form.boxes.map((box) => box.text || ""),
      created_at: new Date().toISOString(),
    };
    savedMemes.unshift(newMeme);
    localStorage.setItem("memeHistory", JSON.stringify(savedMemes));
  };

  const generatememe = () => {
    let url = `https://api.imgflip.com/caption_image?template_id=${form.template_id}&username=${form.username}&password=${form.password}`;
    form.boxes.map((box, index) => {
      return (url += `&boxes[${index}][text]=${box.text}`);
    });

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          setMeme({ ...meme, url: data.data.url, description });
          setMemeGenerated(true);
          saveMemeToHistory({ ...data.data, description });
        } else {
          alert("Enter Some Text");
        }
      });
  };

  const save = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", meme.url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(this.response);
      const tag = document.createElement("a");
      tag.href = imageUrl;
      tag.download = "meme";
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    };
    xhr.send();
  };

  const shareToTwitter = () => {
    const text = "Check out this meme I made!";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(meme.url)}`;
    window.open(url, "_blank");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      meme.url
    )}`;
    window.open(url, "_blank");
  };

  const shareToReddit = () => {
    const title = "Check out this meme I made!";
    const url = `https://reddit.com/submit?url=${encodeURIComponent(
      meme.url
    )}&title=${encodeURIComponent(title)}`;
    window.open(url, "_blank");
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(meme.url)
      .then(() => alert("Meme URL copied to clipboard!"))
      .catch(() => alert("Failed to copy URL"));
  };

  return (
    <div className="memebnao">
      <img src={meme.url} alt="meme"></img>

      <div className="input-container">
        {[...Array(meme.box_count)].map((_, index) => (
          <input
            key={index}
            type="text"
            placeholder={`meme caption-${index + 1}`}
            onChange={(e) => {
              const newBox = form.boxes;
              newBox[index] = { text: e.target.value };
              setForm({ ...form, boxes: newBox });
            }}
          />
        ))}

        {/* New description input */}
        <input
          type="text"
          placeholder="Add a description for this meme"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginTop: "10px", padding: "10px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      <div className="btns">
        <button className="backbtn" title="Back" onClick={() => setMeme(null)}>
          Back
        </button>
        <button className="generatebutton" onClick={generatememe}>
          Generate Meme
        </button>
        <button className="generatebutton" onClick={save}>
          Save
        </button>
      </div>

      {memeGenerated && (
        <div className="share-btns" style={{ marginTop: "15px" }}>
          <h4 style={{ color: "white", marginBottom: "10px", textAlign: "center" }}>
            Share Your Meme:
          </h4>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button className="share-btn twitter" onClick={shareToTwitter}>
              🐦 Twitter
            </button>
            <button className="share-btn facebook" onClick={shareToFacebook}>
              📘 Facebook
            </button>
            <button className="share-btn reddit" onClick={shareToReddit}>
              🔥 Reddit
            </button>
            <button className="share-btn copy" onClick={copyToClipboard}>
              📋 Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meme;
