let markers = [];

function initMap() {
  const centroPortal = { lat: -23.4, lng: -46.855 };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: centroPortal,
    mapId: "DEMO_MAP_ID",
  });

  const infoWindow = new google.maps.InfoWindow();
  const service = new google.maps.places.PlacesService(map);

  markers = escolas.map((escola) => {
    const markerDiv = document.createElement("div");
    markerDiv.innerHTML = `
      <svg width="28" height="44" viewBox="0 0 28 44" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer ">
        <path fill="#3366FF" stroke="white" stroke-width="2" d="M14 0C6 0 0 6 0 14c0 11 14 30 14 30s14-19 14-30c0-8-6-14-14-14z"/>
        <circle fill="white" cx="14" cy="14" r="6"/>
        <circle fill="#3366FF" cx="14" cy="14" r="4"/>
      </svg>
    `;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: escola.coordenadas,
      content: markerDiv,
      title: escola.nome,
    });

    marker.escolaTipo = escola.tipo;

    marker.addEventListener("click", () => {
      service.nearbySearch(
        {
          location: escola.coordenadas,
          radius: 50,
          keyword: escola.nome,
        },
        (results, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results.length > 0
          ) {
            const placeId = results[0].place_id;

            service.getDetails(
              {
                placeId: placeId,
                fields: [
                  "name",
                  "formatted_address",
                  "formatted_phone_number",
                  "website",
                  "url",
                  "rating",
                  "photos",
                ],
              },
              (place, statusDetails) => {
                if (
                  statusDetails === google.maps.places.PlacesServiceStatus.OK &&
                  place
                ) {
                  let photoUrl = "";
                  if (place.photos && place.photos.length > 0) {
                    photoUrl = place.photos[0].getUrl({
                      maxWidth: 250,
                      maxHeight: 150,
                    });
                  }
                  const content = `
  <div style="max-width:300px; font-family:Roboto,Arial,sans-serif; color:#202124;">
    ${
      photoUrl
        ? `
      <div style="margin-bottom:8px;">
        <img src="${photoUrl}" alt="${place.name}" style="width:100%; height:auto; border-radius:8px;">
      </div>
    `
        : ""
    }
    <h2 style="margin:0; font-size:18px; font-weight:500;">${place.name}</h2>
    <p style="margin:4px 0 8px; color:#5f6368; font-size:14px;">${
      place.formatted_address
    }</p>
    
    ${
      place.rating
        ? `
      <div style="display:flex; align-items:center; margin-bottom:8px;">
        <span style="color:#fbbc04; font-size:16px;">${"★".repeat(
          Math.floor(place.rating)
        )}${"☆".repeat(5 - Math.floor(place.rating))}</span>
        <span style="margin-left:6px; color:#70757a; font-size:13px;">${
          place.rating
        } / 5.0</span>
      </div>
    `
        : ""
    }

    ${
      place.formatted_phone_number
        ? `
      <p style="margin:4px 0; font-size:14px;">
        📞 <b>${place.formatted_phone_number}</b>
      </p>
    `
        : ""
    }

    ${
      place.website
        ? `
      <p style="margin:4px 0; font-size:14px;">
        🌐 <a href="${place.website}" target="_blank" rel="noopener" style="color:#1a73e8; text-decoration:none;">Site Oficial</a>
      </p>
    `
        : ""
    }

    <div style="margin-top:8px;">
      <a href="${
        place.url
      }" target="_blank" rel="noopener" style="display:inline-block; background:#1a73e8; color:#fff; padding:6px 12px; border-radius:4px; text-decoration:none; font-size:14px;">Ver no Google Maps</a>
    </div>
  </div>
`;

                  infoWindow.setContent(content);
                  infoWindow.open(map, marker);
                } else {
                  infoWindow.setContent(
                    `<p>Detalhes não encontrados para ${escola.nome}.</p>`
                  );
                  infoWindow.open(map, marker);
                }
              }
            );
          } else {
            const content = `
              <div style="max-width:250px;">
                <h3>${escola.nome}</h3>
                <p>${escola.endereco}</p>
                <p><i>Informações detalhadas não disponíveis no Google Places.</i></p>
              </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          }
        }
      );
    });

    return marker;
  });

  function filtrarMarcadores(tipo) {
    markers.forEach((marker) => {
      if (tipo === "todas" || marker.escolaTipo === tipo) {
        marker.setMap(map);
      } else {
        marker.setMap(null);
      }
    });
  }

  const selectFiltro = document.getElementById("filtroTipo");
  selectFiltro.addEventListener("change", () => {
    filtrarMarcadores(selectFiltro.value);
  });

  filtrarMarcadores("todas");
}

window.initMap = initMap;

const toggleHeaderBtn = document.getElementById("toggle-header-btn");
const header = document.querySelector("header");

toggleHeaderBtn.addEventListener("click", () => {
  header.classList.toggle("hide");

  const icon = toggleHeaderBtn.querySelector("i");

  if (header.classList.contains("hide")) {    
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
});
