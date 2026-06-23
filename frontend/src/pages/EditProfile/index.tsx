import useRequiredAuth from '@/hooks/useRequiredAuth';

import Form from '@/components/Form';
import type { FieldProps, FormData } from '@/components/Form';

import type { AvatarState } from '@/components/AvatarChooser';
import AvatarChooser from '@/components/AvatarChooser';

import { updateUserProfile } from '@/services/userService';

export interface Profile {
  email: string;
  full_name: string;
  profile_pic: AvatarState;
}

const EditProfile = () => {
  const { user, setUser } = useRequiredAuth();

  const initialFormData: Profile = {
    email: user.email ?? '',
    full_name: user.full_name ?? '',
    profile_pic: {
      mode: 'current',
      currentUrl: user.profile_pic,
    },
  };

  const fields: FieldProps<Profile>[] = [
    { type: 'text', name: 'full_name', label: 'Full name' },
    { type: 'text', name: 'email', label: 'Email address' },
    {
      type: 'custom',
      name: 'profile_pic',
      label: 'Profile pic',
      render: ({ value, onChange }) => (
        <AvatarChooser
          value={value as unknown as AvatarState}
          onChange={(data) => onChange(data as unknown as FormData)}
        />
      ),
    },
  ];

  const handleSubmit = async (data: Profile) => {
    try {
      const result = await updateUserProfile(data);

      setUser((prevUser) => {
        if (!prevUser) {
          return null;
        }

        return {
          ...prevUser,
          email: result?.email ?? '',
          full_name: result?.full_name ?? '',
          profile_pic: result?.profile_pic ?? '',
        };
      });

      console.log(result);
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <div>
      <Form
        fields={fields}
        initialData={initialFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditProfile;
