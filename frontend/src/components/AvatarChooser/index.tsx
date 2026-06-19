import { useEffect, useMemo, useRef, useState } from 'react';

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

  const currentAvatarUrl = value.currentUrl ?? defaultAvatar;

  const showNew = value.mode === 'new' && previewUrl && isNewImageLoaded;
  const showCurrent = value.mode === 'current' && !showNew;
  const showDefault =
    value.mode === 'delete' || (value.mode === 'new' && !showNew);

  const previewImagesStyle: React.CSSProperties = {
    width: 150,
    height: 150,
    objectFit: 'cover',
    borderRadius: '50%',
  };

  return (
    <div>
      <div>
        <img
          src={currentAvatarUrl}
          style={{
            ...previewImagesStyle,
            display: showCurrent ? 'block' : 'none',
          }}
        />
        <img
          src={defaultAvatar}
          style={{
            ...previewImagesStyle,
            display: showDefault ? 'block' : 'none',
          }}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            onLoad={() => setIsNewImageLoaded(true)}
            style={{
              ...previewImagesStyle,
              display: showNew ? 'block' : 'none',
            }}
          />
        )}
        {/* <img
          ref={imgPreviewRef}
          src={displayedAvatar}
          alt="Avatar preview"
          width={150}
          height={150}
          style={{
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        /> */}
      </div>
      <div>
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
      </div>

      {value.mode === 'new' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={fileHandler}
            style={{ display: 'none' }}
          />
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            Choose a file
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarChooser;
