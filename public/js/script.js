// Mendapatkan waktu dalam bentuk jam, menit dan detik.

const getDuration = (seconds) => {
  const hour = parseInt(seconds / 3600);
  const minute = parseInt((seconds / 60) % 60);
  const second = parseInt(seconds % 60);

  return hour > 0
    ? `${hour} jam ${minute} menit ${second} detik`
    : `${minute} menit ${second} detik`;
};

// Format uang menjadi tiga angka di belakang koma.

const moneyFormatting = (currency) => {
  return currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const calculateOngkir = () => {
  // Input oleh user.

  const userAddress = document.getElementById("userAddress").value;
  const itemLength = document.getElementById("itemLength").value;
  const itemWidth = document.getElementById("itemWidth").value;
  const itemHeight = document.getElementById("itemHeight").value;
  const itemWeight = document.getElementById("itemWeight").value;

  // const finalResult = document.getElementById("finalResult");

  // Akan diisi setelah data didapatkan.

  const item = document.getElementById("item");
  const resultAddress = document.getElementById("resultAddress");
  const resultDistance = document.getElementById("resultDistance");
  const resultDuration = document.getElementById("resultDuration");
  const resultTotal = document.getElementById("resultTotal");

  // Jika input kosong maka alert dan reload.

  if (
    userAddress == "" ||
    itemLength == "" ||
    itemWidth == "" ||
    itemHeight == "" ||
    itemWeight == ""
  ) {
    alert("Input tidak boleh kosong!");
    location.reload();
  } else {
    // Buat map.

    const map = L.map("map").setView([0, 0], 13);

    // Tambahkan peta awal pada map.

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const geocoder = L.Control.Geocoder.nominatim();

    // Dapatkan lokasi dengan menggunakan geocoder.

    geocoder.geocode(userAddress, function (a, b) {
      if (typeof a == "undefined" || a.length == 0) {
        alert("Alamat tidak ditemukan!");
        location.reload();
      }

      if (typeof a !== "undefined" && a.length > 0) {
        const { name, center } = a[0];
        const { lat, lng } = center;

        console.log(name);
        console.log(center);

        // Buat route dari lokasi default ke lokasi user.

        const routeControl = L.Routing.control({
          waypoints: [
            L.latLng(-7.437092191343427, 109.26223039627075),
            L.latLng(lat, lng),
          ],
          routeWhileDragging: true,
          geocoder: L.Control.Geocoder.nominatim(),
        }).addTo(map);

        // Jika route ditemukan maka lakukan kalkulasi.

        routeControl.on("routesfound", function (e) {
          const routes = e.routes;
          const summary = routes[0].summary;

          console.log(routes);
          console.log(summary);

          // Jarak dan waktu dari lokasi

          const distance = summary.totalDistance / 1000;
          const times = summary.totalTime;

          // Tarif per kg.

          const tarif = 6000;

          // cm
          const panjang = parseFloat(itemLength);
          const lebar = parseFloat(itemWidth);
          const tinggi = parseFloat(itemHeight);

          // kg
          const berat = parseFloat(itemWeight);

          // Volume dan biaya dari barang.

          const volume = (panjang * lebar * tinggi) / tarif;
          const biaya = parseFloat(volume * berat * tarif);

          console.log(`Volume: ${volume}`);
          console.log(`Biaya: Rp ${biaya}`);

          console.log(`Distance: ${distance}, total times: ${times}`);

          // Tampilkan hasil kalkulasi.

          item.innerHTML = `${panjang}x${lebar}x${tinggi} cm / ${volume} cm<sup>3</sup> / ${berat} kg.`;
          resultAddress.innerHTML = `${name}.`;
          resultDistance.innerHTML = `${distance} km dari lokasi.`;
          resultDuration.innerHTML = `${getDuration(times)} dari lokasi.`;
          resultTotal.innerHTML = `Rp ${moneyFormatting(biaya)}.`;

          // finalResult.classList.remove("hidden");
        });
      } else if (typeof b !== "undefined" && b.length > 0) {
        console.log(b);
      }
    });
  }
};
