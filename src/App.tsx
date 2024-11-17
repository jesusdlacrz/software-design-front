import {RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import {router} from './routes/routes';


const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="app">
                <RouterProvider router={router} />
            </div>
        </QueryClientProvider>
    );
};

export default App;
