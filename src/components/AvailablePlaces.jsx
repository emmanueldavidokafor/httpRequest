import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
	const [isFetching, setIsFetching] = useState(false);
	const [availablePlaces, setAvailablePlaces] = useState([]);
	const [error, setError] = useState();

	useEffect(() => {
		async function fetchPlaces() {
			setIsFetching(true);
			try {
				const places = await fetchAvailablePlaces();

				if (!navigator.geolocation) {
					throw new Error('Geolocation is not supported by your browser');
				}

				navigator.geolocation.getCurrentPosition((position) => {
					const sortedPlaces = sortPlacesByDistance(
						places,
						position.coords.latitude,
						position.coords.longitude
					);
					setAvailablePlaces(sortedPlaces);
					setIsFetching(false);
				});

				// navigator.geolocation.getCurrentPosition(
				// 	(position) => {
				// 		const sortedPlaces = sortPlacesByDistance(
				// 			places,
				// 			position.coords.latitude,
				// 			position.coords.longitude
				// 		);
				// 		setAvailablePlaces(sortedPlaces);
				// 		setIsFetching(false);
				// 	},
				// 	() => {
				// 		// Handle user denying location access or error
				// 		setError({ message: 'Could not retrieve location' });
				// 		setIsFetching(false);
				// 	}
				// );
			} catch (error) {
				setError({
					message:
						error.message || 'Could not fetch places, please try again later.',
				});
				setIsFetching(false);
			}
		}

		fetchPlaces();
	}, []);

	if (error) {
		return <Error title='An error occured' message={error.message} />;
	}

	return (
		<Places
			title='Available Places'
			places={availablePlaces}
			isLoading={isFetching}
			loadingText='Fetching place data...'
			fallbackText='No places available.'
			onSelectPlace={onSelectPlace}
		/>
	);
}
