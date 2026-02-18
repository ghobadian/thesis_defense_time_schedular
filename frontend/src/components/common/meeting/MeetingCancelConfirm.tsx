// src/components/common/meeting/MeetingCancelConfirm.tsx
import React from 'react';
import {AlertCircle} from 'lucide-react';
import {Button} from '../Button';
import {Meeting} from '../../../types';
import {useTranslation} from "react-i18next";

interface MeetingCancelConfirmProps {
    meeting: Meeting;
    isCancelling: boolean;
    onConfirm: (meeting: Meeting) => void;
    onDismiss: () => void;
}

export const MeetingCancelConfirm: React.FC<MeetingCancelConfirmProps> = ({
                                                                              meeting,
                                                                              isCancelling,
                                                                              onConfirm,
                                                                              onDismiss
                                                                          }) => {
    const {t} = useTranslation("common");

    return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0"/>
            <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-800">{t("confirm_cancellation")}</h4>
                <p className="text-sm text-red-700 mt-1">{t("are_you_sure_you_want_to_cancel_this_meeting_this")}</p>
                <div className="flex space-x-3 mt-3">
                    <Button
                        variant="primary"
                        onClick={() => onConfirm(meeting)}
                        disabled={isCancelling}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5">
                        {isCancelling ? t('cancelling') : t('yes_cancel_meeting')}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onDismiss}
                        disabled={isCancelling}
                        className="text-sm px-4 py-1.5">{t("no_keep_it")}
                    </Button>
                </div>
            </div>
        </div>
    </div>);
}