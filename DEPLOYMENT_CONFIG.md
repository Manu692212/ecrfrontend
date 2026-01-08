# Deployment Configuration Guide

## Frontend Environment Variables

The frontend needs the following environment variable configured in your deployment platform (Render, Vercel, etc.):

### VITE_API_URL

**Required for production deployments with a separate backend server.**

Set this to your backend API base URL. For example:

```
VITE_API_URL=https://ecrbackend.onrender.com/api
```

### How API URL Resolution Works

The frontend uses the following logic to determine the API base URL:

1. **Development Mode (`npm run dev`)**
   - Uses: `http://localhost:8000/api` (hardcoded)
   - This matches the `vite.config.ts` proxy configuration

2. **Production Mode (without `VITE_API_URL`)**
   - Uses: `/api` (relative path)
   - Only works if backend is served from the same domain/origin
   - Example: If frontend is at `https://example.com`, backend must be at `https://example.com/api`

3. **Production Mode (with `VITE_API_URL`)**
   - Uses: The value of `VITE_API_URL` environment variable
   - Allows separate backend server on different domain
   - Example: Frontend at `https://ecrfrontend.onrender.com`, Backend at `https://ecrbackend.onrender.com/api`

## Current Setup

- **Frontend**: https://ecrfrontend.onrender.com
- **Backend**: https://ecrbackend.onrender.com
- **Required Config**: `VITE_API_URL=https://ecrbackend.onrender.com/api`

## Render Deployment Steps

1. Go to your frontend service on Render
2. Go to **Settings** → **Environment** or **Environment**
3. Add a new environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://ecrbackend.onrender.com/api`
4. Save changes
5. Trigger a new deployment (redeploy from git)

## Verify Configuration

After deployment, check the browser console:
- Open Developer Tools (F12)
- Go to **Console** tab
- The API calls should now be going to `https://ecrbackend.onrender.com/api/public/academic-council`

## Testing API Endpoint

Test if the backend endpoint is working:

```bash
curl https://ecrbackend.onrender.com/api/public/academic-council
```

Expected response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Member Name",
      "designation": "Position",
      ...
    }
  ]
}
```

If empty array is returned:
```json
{
  "data": []
}
```

This means the endpoint is working but no data exists yet. Add data via the admin panel.
