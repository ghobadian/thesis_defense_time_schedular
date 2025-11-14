import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const ProfilePage: React.FC = () => {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>

            <Card title="Personal Information">
                <div className="space-y-4">
                    <Input label="First Name" defaultValue="John" disabled={!isEditingProfile} />
                    <Input label="Last Name" defaultValue="Doe" disabled={!isEditingProfile} />
                    <Input label="Email" defaultValue="student@test.com" disabled />
                    <Input label="Phone Number" defaultValue="+98 912 345 6789" disabled={!isEditingProfile} />

                    {!isEditingProfile ? (
                        <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
                    ) : (
                        <div className="flex space-x-2">
                            <Button>Save Changes</Button>
                            <Button variant="secondary" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Change Password">
                {!isChangingPassword ? (
                    <Button onClick={() => setIsChangingPassword(true)}>Change Password</Button>
                ) : (
                    <div className="space-y-4">
                        <Input type="password" label="Current Password" />
                        <Input type="password" label="New Password" />
                        <Input type="password" label="Confirm New Password" />
                        <div className="flex space-x-2">
                            <Button>Update Password</Button>
                            <Button variant="secondary" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
