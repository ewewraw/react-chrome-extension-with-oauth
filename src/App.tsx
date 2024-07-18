import { useEffect, useRef } from 'react';
import './App.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { authenticate } from './oauth';
import { getUnreadEmails } from './gmail';
import { sortEmails } from './sorter';

function App() {
  return (
    <div className="App">
      <Stack spacing={2} direction="column">
        <Button variant="contained" id='auth-btn' onClick={authenticate}>Authorize</Button>
        <Button variant="contained" id='gmail-btn' onClick={getUnreadEmails}>Reorganize</Button>
      </Stack>
    </div>
  );
}

export default App;