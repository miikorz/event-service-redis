const formatSpecificDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
}

  const getMinPriceFromZones = (zones: any[]): number => {
    return zones.reduce((minPrice, zone) => (parseInt(zone.price) < minPrice ? parseInt(zone.price) : minPrice), zones[0].price);
  };

  const getMaxPriceFromZones = (zones: any[]): number => {
    return zones.reduce((maxPrice, zone) => (parseInt(zone.price) > maxPrice ? parseInt(zone.price) : maxPrice), 0);
  }

export { formatSpecificDate, getMinPriceFromZones, getMaxPriceFromZones };