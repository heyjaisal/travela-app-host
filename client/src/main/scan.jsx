// import { useState, useEffect } from 'react';
// import { QrReader } from 'react-qr-reader';
// import { CheckCircle2, XCircle, Send, CameraOff, Camera } from 'lucide-react';
// import axios from 'axios';

// const SimpleQrScanner = () => {
//   const [data, setData] = useState('');
//   const [error, setError] = useState('');
//   const [cameraOn, setCameraOn] = useState(true);
//   const [status, setStatus] = useState('');

//   // Cleanup camera on unmount
//   useEffect(() => () => setCameraOn(false), []);

//   const handleScan = async (result) => {
//     if (result && !data) {
//       setData(result);
//       setCameraOn(false);
//       await sendData(result);
//     }
//   };

//   const sendData = async (qrData) => {
//     setStatus('Sending...');
//     try {
//       await axios.post('YOUR_BACKEND_ENDPOINT', { qrData });
//       setStatus('Sent successfully!');
//     } catch (err) {
//       setError('Send failed: ' + err.message);
//       setStatus('Failed to send');
//     }
//   };

//   const resetScanner = () => {
//     setData('');
//     setError('');
//     setStatus('');
//     setCameraOn(true);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
//       <header className="w-full max-w-md mb-4 flex justify-between">
//         <h1 className="text-2xl font-bold text-blue-600">QR Scanner</h1>
//         <button 
//           onClick={() => setCameraOn(!cameraOn)} 
//           className="p-2 bg-white rounded-full shadow"
//         >
//           {cameraOn ? <CameraOff className="text-blue-600" /> : <Camera className="text-blue-600" />}
//         </button>
//       </header>

//       <div className="relative w-full max-w-md aspect-square mb-4">
//         {cameraOn ? (
//           <div className="absolute inset-0 bg-white rounded-xl overflow-hidden border-2 border-blue-300">
//             <QrReader
//               constraints={{ facingMode: 'environment' }}
//               onResult={handleScan}
//               onError={(err) => setError(err.message)}
//               videoStyle={{ width: '100%', height: '100%' }}
//             />
//             <div className="absolute inset-0 border-4 border-dashed border-blue-400 opacity-30 pointer-events-none" />
//           </div>
//         ) : (
//           <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
//             <button 
//               onClick={() => setCameraOn(true)}
//               className="p-4 bg-white rounded-full shadow"
//             >
//               <Camera className="text-blue-600" />
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="w-full max-w-md">
//         {error ? (
//           <div className="bg-red-100 p-3 rounded-lg mb-3 flex items-start">
//             <XCircle className="text-red-500 mr-2" />
//             <div>
//               <p>{error}</p>
//               <button onClick={resetScanner} className="mt-2 text-sm text-red-600">
//                 Try Again
//               </button>
//             </div>
//           </div>
//         ) : data ? (
//           <div className="bg-white p-4 rounded-lg shadow mb-3">
//             <div className="flex items-center mb-2">
//               <CheckCircle2 className="text-green-500 mr-2" />
//               <h2 className="font-medium">Scanned Data</h2>
//             </div>
//             <div className="bg-gray-50 p-2 rounded mb-3">
//               <p className="break-all text-sm">{data}</p>
//             </div>
//             {status && <p className={`text-sm mb-2 ${status.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>{status}</p>}
//             <div className="flex space-x-2">
//               <button 
//                 onClick={() => sendData(data)} 
//                 className="flex-1 bg-blue-500 text-white py-2 rounded flex justify-center items-center"
//               >
//                 <Send className="mr-1" size={16} /> Resend
//               </button>
//               <button 
//                 onClick={resetScanner} 
//                 className="flex-1 bg-gray-200 py-2 rounded"
//               >
//                 Scan Again
//               </button>
//             </div>
//           </div>
//         ) : (
//           <p className="text-center text-gray-500">
//             {cameraOn ? 'Point camera at QR code' : 'Camera is off'}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SimpleQrScanner;
import React from 'react'

export default function Scan() {
  return (
    <div>scan</div>
  )
}
