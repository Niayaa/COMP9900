export function deleteEvent(eventId, onSuccess, onError) {
    const url = `http://127.0.0.1:8000/delete_event/?event_id=${eventId}`;

    try {
      const response = fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary headers, such as Authorization headers
        },
      });

      if (response.ok) {
        onSuccess(eventId);
      } else {
        const responseClone = response.clone(); // Clone the response for safe reuse
        try {
          const errorData = responseClone.json();
          console.error('Failed to delete the event:', errorData);
          onError('Error deleting event. Please try again.');
        } catch (parseError) {
          const errorText = response.text(); // Read text from the original response
          console.error('Failed to delete the event:', errorText);
          onError('Error deleting event. Server response not in JSON format.');
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      onError('Error communicating with the server. Please try again.');
    }
}

  