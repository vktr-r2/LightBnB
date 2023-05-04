SELECT city, COUNT(reservations.property_id) AS total_reservations
  FROM properties
  JOIN reservations ON properties.id = reservations.property_id
    GROUP BY city
    ORDER BY total_reservations DESC;