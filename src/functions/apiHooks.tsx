import { useState } from 'react';

interface ApiState {
    list: any[];
    loading: boolean;
    error: string | null;
}

type SetSuccess = (data: any[]) => void;
type SetLoading = () => void;
type SetError = (errorMessage: string) => void;

const useApiState = (): [ApiState, SetLoading, SetSuccess, SetError] => {
    const [state, setState] = useState<ApiState>({
        list: [],
        loading: false,
        error: null,
    });

    const setLoading: SetLoading = () => setState(prev => ({ ...prev, loading: true }));
    const setSuccess: SetSuccess = (data) => setState({ list: data, loading: false, error: null });
    const setError: SetError = (errorMessage) => setState({ list: [], loading: false, error: errorMessage });

    return [state, setLoading, setSuccess, setError];
};

export default useApiState;
