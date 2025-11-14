import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentAPI } from '../../api/student.api';
import { Card } from '../../components/common/Card';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import {FormState, ThesisForm} from '../../types';

export const MyThesisForms: React.FC = () => {
  const { data: thesisForms, isLoading } = useQuery({
    queryKey: ['myThesisForms'],
    queryFn: studentAPI.getMyThesisForms,
  });

  const getStateIcon = (state: FormState) => {
    switch (state) {
      case FormState.SUBMITTED:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case FormState.INSTRUCTOR_APPROVED:
      case FormState.ADMIN_APPROVED:
      case FormState.MANAGER_APPROVED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStateLabel = (state: FormState) => {
    return state.replace(/_/g, ' ');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">My Thesis Forms</h2>

      {thesisForms?.length === 0 ? (
        <Card>
          <p className="text-gray-600 text-center py-8">
            You haven't submitted any thesis forms yet.
          </p>
        </Card>
      ) : (
        thesisForms?.map((form: ThesisForm) => (
          <Card key={form.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {form.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {form.abstractText}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Field:</span>
                    <span className="ml-2 font-medium">{form.fieldName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Instructor:</span>
                    <span className="ml-2 font-medium">
                      {form.instructorFirstName} {form.instructorLastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted:</span>
                    <span className="ml-2 font-medium">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {getStateIcon(form.state)}
                <span className="text-sm font-medium capitalize">
                  {getStateLabel(form.state)}
                </span>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
