import { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { getAttendeeByQRCode } from '../api/api';
import { Button } from './ui/button';
import {  CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CameraOff, RefreshCw, Scan } from 'lucide-react';

export function QRScanner({ onAttendeeFound }) {
  const [startScan, setStartScan] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    // Check camera permissions when component mounts
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        // Make sure to stop the stream after checking
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setHasPermission(false);
        setError('Camera permission denied. Please enable camera access in your browser settings.');
      }
    };

    checkPermissions();
  }, []);

  const handleScan = async (data) => {
    if (data) {
      setScanning(true);
      try {
        if (data === 'TechGuruMeetup2025') {
          onAttendeeFound({ isNewAttendee: true });
        } else {
          const attendee = await getAttendeeByQRCode(data);
          onAttendeeFound(attendee);
        }
        setStartScan(false);
        setScanning(false);
      } catch (error) {
        setError('Invalid QR code or attendee not found');
        setScanning(false);
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner Error:', err);
    if (err.name === 'NotAllowedError') {
      setError('Camera access denied. Please enable camera permissions in your browser settings.');
    } else if (err.name === 'NotFoundError') {
      setError('No camera found. Please make sure your device has a camera.');
    } else if (err.name === 'NotReadableError') {
      setError('Camera is in use by another application. Please close other apps using the camera.');
    } else {
      setError('Error accessing camera. Please refresh and try again.');
    }
    setStartScan(false);
  };

  const toggleScanner = async () => {
    if (!startScan) {
      try {
        // Try to access camera before starting scanner
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setError(null);
        setStartScan(true);
      } catch (err) {
        handleError(err);
      }
    } else {
      setStartScan(false);
    }
  };

  const toggleCamera = () => {
    setStartScan(false);
    setError(null);
    setTimeout(() => {
      setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
      setStartScan(true);
    }, 300);
  };

  const retryScanner = async () => {
    setError(null);
    setStartScan(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setTimeout(() => setStartScan(true), 300);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-3">
        <CardTitle className="flex items-center justify-center gap-2">
          <Scan className="w-6 h-6" />
          QR Code Scanner
        </CardTitle>
        <CardDescription>
          Please position the QR code within the scanning area
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-4">
          <Button 
            onClick={toggleScanner}
            className="flex-1 mr-2"
            variant={startScan ? "destructive" : "default"}
          >
            {startScan ? (
              <div className="flex items-center gap-2">
                <CameraOff className="w-4 h-4" />
                Stop Scanner
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Start Scanner
              </div>
            )}
          </Button>
          {startScan && (
            <Button 
              onClick={toggleCamera} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Flip
            </Button>
          )}
        </div>

        {startScan && hasPermission && (
          <div className="relative">
            <div className={`rounded-lg overflow-hidden ${scanning ? 'opacity-50' : ''}`}>
              <QrReader
                onResult={(result, error) => {
                  if (result) {
                    handleScan(result.getText());
                  }
                  if (error && error?.message?.includes('not found')) {
                    handleError(new Error('NotFoundError'));
                  }
                }}
                constraints={{
                  facingMode,
                  aspectRatio: 1
                }}
                videoId="qr-video"
                className="w-full aspect-square"
                ViewFinder={() => (
                  <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg" />
                )}
              />
            </div>
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryScanner}
                className="ml-2"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </div>
  );
}