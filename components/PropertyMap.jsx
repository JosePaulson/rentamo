'use client'
import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function PropertyMap({ draggable = false, locatePin = false, currentLoc, setLngLat = null }) {
	const [loc, setLoc] = useState({ longitude: 0, latitude: 0 })
	const mapContainer = useRef(null);
	const map = useRef(null);
	const zoom = locatePin ? 17 : 14;
	maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

	useEffect(() => {
		async function getLocation() {
			try {
				const position = await maptilersdk.geolocation.info()
				const longitude = position.longitude
				const latitude = position.latitude;
				setLoc({ longitude, latitude })
				setLngLat({ longitude, latitude })
				// You can use these coordinates to center your map, etc.
			} catch (error) {
				console.error("Could not get location:", error);
			}
		}

		locatePin ? getLocation() : setLoc(currentLoc)
	}, [])
	useEffect(() => {
		if (map.current) return; // stops map from intializing more than once

		if (loc?.longitude && loc?.latitude) {

			map.current = new maptilersdk.Map({
				container: mapContainer.current,
				style: maptilersdk.MapStyle.STREETS,
				center: [loc.longitude, loc.latitude],
				zoom: zoom
			});

			let marker = new maptilersdk.Marker({
				draggable: draggable,
				color: "#ff0000"
			})
				.setLngLat([loc.longitude, loc.latitude])
				.addTo(map.current);

			if (draggable) {
				function handleDragEnd() {
					let lngLat = marker.getLngLat()
					setLngLat({ longitude: lngLat.lng, latitude: lngLat.lat })
				}

				marker.on('dragend', handleDragEnd)
			}
		}

	}, [loc.longitude, loc.latitude, zoom]);




	return (
		<div className="relative w-full h-[50vh]">
			<div ref={mapContainer} className="absolute w-full h-full" />
		</div>
	);
}