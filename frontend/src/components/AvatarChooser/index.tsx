import { useEffect, useMemo, useRef, useState } from 'react';

import './style.css';

export type AvatarMode = 'current' | 'delete' | 'new';

export interface AvatarState {
  mode: AvatarMode;
  currentUrl?: string;
  file?: File;
}

interface AvatarChooserProps {
  value: AvatarState;
  onChange: (data: AvatarState) => void;
  defaultAvatar?: string;
}

const AvatarChooser = ({
  value,
  onChange,
  defaultAvatar = '/blank-profile-picture.png',
}: AvatarChooserProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isNewImageLoaded, setIsNewImageLoaded] = useState(false);

  const previewUrl = useMemo(() => {
    return value.file ? URL.createObjectURL(value.file) : null;
  }, [value.file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const radioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, mode: e.target.value as AvatarMode });
  };

  const fileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setIsNewImageLoaded(false);

    onChange({
      ...value,
      mode: 'new',
      file,
    });
  };

  const currentAvatarUrl = value.currentUrl
    ? `${import.meta.env.VITE_APP_STATIC_FILES_URL}/${value.currentUrl}`
    : defaultAvatar;

  const showNew = value.mode === 'new' && previewUrl && isNewImageLoaded;
  const showCurrent = value.mode === 'current' && !showNew;
  const showDefault =
    value.mode === 'delete' || (value.mode === 'new' && !showNew);

  return (
    <div className="avatar-chooser">
      <div className="avatar-preview">
        <img
          src={currentAvatarUrl}
          className="preview-image"
          style={{
            display: showCurrent ? 'block' : 'none',
          }}
        />
        <img
          src={defaultAvatar}
          className="preview-image"
          style={{
            display: showDefault ? 'block' : 'none',
          }}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            className="preview-image"
            onLoad={() => setIsNewImageLoaded(true)}
            style={{
              display: showNew ? 'block' : 'none',
            }}
          />
        )}
      </div>
      <div className="avatar-mode">
        <label>
          <input
            type="radio"
            name="mode"
            value="current"
            checked={value.mode === 'current'}
            onChange={radioHandler}
          />{' '}
          Current
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="delete"
            checked={value.mode === 'delete'}
            onChange={radioHandler}
          />{' '}
          Delete
        </label>
        <div>
          <label>
            <input
              type="radio"
              name="mode"
              value="new"
              checked={value.mode === 'new'}
              onChange={radioHandler}
            />{' '}
            New
          </label>
          {value.mode === 'new' && (
            <span className="avatar-file-input">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={fileHandler}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose a file
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarChooser;
