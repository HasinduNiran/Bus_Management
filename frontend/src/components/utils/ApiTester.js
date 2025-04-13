import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import axios from '../../api/axios';

const ApiTester = () => {
  const [endpoint, setEndpoint] = useState('/Customer/login');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('{}');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setResponse(null);
    setError(null);
    
    try {
      let data = null;
      try {
        data = JSON.parse(requestBody);
      } catch (e) {
        setError('Invalid JSON in request body');
        return;
      }
      
      let result;
      if (method === 'GET') {
        result = await axios.get(endpoint);
      } else if (method === 'POST') {
        result = await axios.post(endpoint, data);
      }
      
      setResponse(result.data);
    } catch (err) {
      setError({
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>API Endpoint Tester</Typography>
      
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Endpoint"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          fullWidth
          margin="normal"
        />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant={method === 'GET' ? 'contained' : 'outlined'}
            onClick={() => setMethod('GET')}
          >
            GET
          </Button>
          <Button
            variant={method === 'POST' ? 'contained' : 'outlined'}
            onClick={() => setMethod('POST')}
          >
            POST
          </Button>
        </Box>
        
        {method === 'POST' && (
          <TextField
            label="Request Body (JSON)"
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        )}
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleTest}
          sx={{ mt: 2 }}
        >
          Test Endpoint
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Error: {error.message}</Typography>
          {error.status && (
            <Typography variant="body2">Status: {error.status} {error.statusText}</Typography>
          )}
          {error.data && (
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(error.data, null, 2)}
            </pre>
          )}
        </Alert>
      )}
      
      {response && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Response:</Typography>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default ApiTester;
