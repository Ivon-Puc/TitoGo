import React, { useEffect, useState } from 'react';

const TripsPage = () => {
  const [drivingTrips, setDrivingTrips] = useState([]);
  const [ridingTrips, setRidingTrips] = useState([]);
  const [loadingDriving, setLoadingDriving] = useState(true);
  const [loadingRiding, setLoadingRiding] = useState(true);

  // Fetch Driving trips
  const fetchDrivingTrips = async () => {
    setLoadingDriving(true);
    try {
      const response = await fetch('http://localhost:3000/trips/driving', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setDrivingTrips(data);
    } catch (error) {
      console.error('Error fetching driving trips:', error);
    } finally {
      setLoadingDriving(false);
    }
  };

  // Fetch Riding trips
  const fetchRidingTrips = async () => {
    setLoadingRiding(true);
    try {
      const response = await fetch('http://localhost:3000/trips/riding', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setRidingTrips(data);
    } catch (error) {
      console.error('Error fetching riding trips:', error);
    } finally {
      setLoadingRiding(false);
    }
  };

  // Handle request status change
  const handleRequestStatusChange = async (requestId, status) => {
    try {
      await fetch(`http://localhost:3000/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      // Re-fetch trips to update the UI
      await fetchDrivingTrips();
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  useEffect(() => {
    fetchDrivingTrips();
    fetchRidingTrips();
  }, []);

  return (
    <div className="p-6 font-sans">
      {/* Driving Section */}
      <div className="mb-8">
        <h2 className="font-bold text-xl mb-4">Driving</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Origin</th>
              <th className="border border-gray-300 px-4 py-2">Destination</th>
              <th className="border border-gray-300 px-4 py-2">Rider Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loadingDriving ? (
              <tr>
                <td colSpan="4" className="text-center p-4">Loading...</td>
              </tr>
            ) : (
              drivingTrips.map((trip) =>
                trip.requests.map((request) => (
                  <tr key={request.id}>
                    <td className="border border-gray-300 px-4 py-2">{trip.origin}</td>
                    <td className="border border-gray-300 px-4 py-2">{trip.destination}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {request.user.firstName} {request.user.lastName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-red-500 text-black font-bold px-4 py-2 rounded mr-2"
                        onClick={() => handleRequestStatusChange(request.id, 'DECLINED')}
                      >
                        Decline
                      </button>
                      <button
                        className="bg-yellow-500 text-black font-bold px-4 py-2 rounded mr-2"
                        onClick={() => handleRequestStatusChange(request.id, 'PENDING')}
                      >
                        Ignore
                      </button>
                      <button
                        className="bg-green-500 text-black font-bold px-4 py-2 rounded"
                        onClick={() => handleRequestStatusChange(request.id, 'APPROVED')}
                      >
                        Accept
                      </button>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Riding Section */}
      <div>
        <h2 className="font-bold text-xl mb-4">Riding</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Origin</th>
              <th className="border border-gray-300 px-4 py-2">Destination</th>
              <th className="border border-gray-300 px-4 py-2">Departure Time</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loadingRiding ? (
              <tr>
                <td colSpan="4" className="text-center p-4">Loading...</td>
              </tr>
            ) : (
              ridingTrips.map((request) => (
                <tr key={request.id}>
                  <td className="border border-gray-300 px-4 py-2">{request.share.origin}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.share.destination}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(request.share.departureTime).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{request.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripsPage;