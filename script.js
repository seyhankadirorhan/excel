const infixToFunction = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
}

function infixEval(str, regex) {
  // str: İşlem yapılacak string (örnek: "2+3")
  // regex: Bu işlemi yakalayacak düzenli ifade

  // replace: regex ile eşleşen ifadeyi bulur ve değiştirir
  return str.replace(regex, function(match, arg1, operator, arg2) {
    // match: Tam eşleşen ifade (örneğin "2+3")
    // arg1: ilk sayı (örneğin "2")
    // operator: işlem operatörü (örneğin "+")
    // arg2: ikinci sayı (örneğin "3")

    // String olan sayıları float'a çeviriyoruz
    const num1 = parseFloat(arg1);
    const num2 = parseFloat(arg2);

    // Operatör fonksiyonunu bulup uyguluyoruz
    const result = infixToFunction[operator](num1, num2);

    // Bu değeri, replace ile yer değiştirmek üzere geri döndürüyoruz
    return result;
  });
}


const highPrecedence = str => {
  const regex = /([\d.]+)([*\/])([\d.]+)/;
  const str2 = infixEval(str, regex);
  return str === str2 ? str : highPrecedence(str2);
}

function isEven(num) {
  if (num % 2 === 0) {
    return true;
  } else {
    return false;
  }
}

function sum(nums) {
  let total = 0;

  for (let i = 0; i < nums.length; i++) {
    total += nums[i];  // her elemanı toplayarak ilerliyoruz
  }

  return total;
}

function average(nums) {
   const total = sum(nums);       // önce toplamı alıyoruz
   const length = nums.length;    // eleman sayısı
   const avg = total / length;    // ortalama hesaplama

   return avg;
 }


function median(nums) {
  // 1. Kopyalayarak diziyi sıralıyoruz (orijinali bozmamak için)
  const sorted = nums.slice(); // .slice() dizinin kopyasını alır
  sorted.sort(function(a, b) {
    return a - b;
  });

  // 2. Eleman sayısını al
  const length = sorted.length;

  // 3. Ortadaki konumu hesapla
  const middle = length / 2 - 1;

  // 4. Eğer eleman sayısı çiftse
  if (isEven(length)) {
    const firstMiddle = sorted[middle];
    const secondMiddle = sorted[middle + 1];
    return average([firstMiddle, secondMiddle]);
  }
  // 5. Eğer eleman sayısı tekse
  else {
    return sorted[Math.ceil(middle)];
  }
}


const spreadsheetFunctions = {
  sum: function(nums) {
    return sum(nums);
  },

  average: function(nums) {
    return average(nums);
  },

  median: function(nums) {
    return median(nums);
  },

  even: function(nums) {
    return nums.filter(function(num) {
      return isEven(num);
    });
  },

  someeven: function(nums) {
    return nums.some(function(num) {
      return isEven(num);
    });
  },

  everyeven: function(nums) {
    return nums.every(function(num) {
      return isEven(num);
    });
  },

  firsttwo: function(nums) {
    return nums.slice(0, 2);
  },

  lasttwo: function(nums) {
    return nums.slice(-2);
  },

  has2: function(nums) {
    return nums.includes(2);
  },

  increment: function(nums) {
    return nums.map(function(num) {
      return num + 1;
    });
  },

  random: function(pair) {
    const x = pair[0];
    const y = pair[1];
    return Math.floor(Math.random() * y + x);
  },

  range: function(nums) {
    return range(...nums);
  },

  nodupes: function(nums) {
    return Array.from(new Set(nums));
  },

  "": function(x) {
    return x;
  }
};



function applyFunction(str) {
  // 1. Önce çarpma ve bölme gibi yüksek öncelikli işlemleri çöz
  const noHigh = highPrecedence(str); // örn: "2*3+4" → "6+4"

  // 2. Basit toplama/çıkarma işlemlerini temsil eden regex (örnek: 6+4)
  const infix = /([\d.]+)([+-])([\d.]+)/;

  // 3. Yukarıdaki ifadeyi çözümle
  const str2 = infixEval(noHigh, infix); // örn: "6+4" → "10"

  // 4. Fonksiyon çağrısı olup olmadığını kontrol eden regex (örnek: SUM(1,2,3))
  const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;

  // 5. Fonksiyon parametrelerini dizi haline çevir
  function toNumberList(args) {
    return args.split(",").map(function(arg) {
      return parseFloat(arg.trim());
    });
  }

  // 6. Fonksiyon ismine göre spreadsheetFunctions içinden uygun fonksiyonu çağır
  function apply(fn, args) {
    const fnName = fn.toLowerCase();
    const numberList = toNumberList(args);
    return spreadsheetFunctions[fnName](numberList);
  }

  // 7. En son: Fonksiyon varsa uygula, yoksa aynen döndür
  const finalResult = str2.replace(functionCall, function(match, fn, args) {
    const fnName = fn.toLowerCase();
    if (spreadsheetFunctions.hasOwnProperty(fnName)) {
      return apply(fn, args);
    } else {
      return match; // tanınmayan fonksiyon varsa değiştirme
    }
  });

  return finalResult;
}


function range(start, end) {
  const length = end - start + 1;
  const arr = new Array(length);

  // Tüm elemanları start ile doldur
  for (let i = 0; i < length; i++) {
    arr[i] = start + i;
  }

  return arr;
}

function charRange(start, end) {
  // Harfleri ASCII (charCode) değerlerine çevir
  const startCode = start.charCodeAt(0);
  const endCode = end.charCodeAt(0);

  // Sayı aralığını al (örneğin 97 - 101)
  const codeArray = range(startCode, endCode);

  // ASCII kodlarını tekrar harfe çevir
  const letterArray = codeArray.map(function(code) {
    return String.fromCharCode(code);
  });

  return letterArray;
}


const evalFormula = (formula, cells) => {
  // Hücre ID'sine göre hücre değerini döndüren yardımcı fonksiyon
  const getValueById = (id) => {
    // 'cells' dizisi içinde dolaşmak için bir döngü başlat
    for (let i = 0; i < cells.length; i++) {
      // Her bir hücreyi al
      const cell = cells[i];

      // Eğer hücrenin id'si verilen id'ye eşitse
      if (cell.id === id) {
        // Hücrenin değerini döndür
        return cell.value;
      }
    }

    // Eğer id ile eşleşen bir hücre bulunamazsa boş string döndür
    return "";
  };


  // A1:B2 gibi hücre aralıklarını yakalayan regex
  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;

  // Sayısal aralığı (örneğin: 1'den 5'e kadar) array olarak döndürür
  const rangeFromString = (startNum, endNum) => {
    const start = parseInt(startNum);
    const end = parseInt(endNum);
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  // Belirli bir satır numarasına göre, bir sütun karakterinden değerleri döndürür
const getCellValueInRow = function(rowNumber) {
  // Bu fonksiyon, verilen satır numarası için başka bir fonksiyon döndürüyor
  return function(columnLetter) {
    // Hücre ID'si, sütun harfi ile satır numarasının birleşiminden oluşur (örneğin: "A1", "B3")
    const cellId = columnLetter + rowNumber;

    // Daha önce tanımlanmış olan getValueById fonksiyonu ile bu hücrenin değeri alınır
    const value = getValueById(cellId);

    // Hücrenin değeri döndürülür
    return value;
  };
};


  // Belirtilen sütun karakterleri arasında tüm hücreleri oluşturur ve satır numarasıyla birlikte değerleri getirir
  const expandColumnRange = function(startChar) {
    // İlk fonksiyon, başlangıç sütun harfini alıyor ve ikinci bir fonksiyon döndürüyor
    return function(endChar) {
      // İkinci fonksiyon, bitiş sütun harfini alıyor ve üçüncü bir fonksiyon döndürüyor
      return function(rowNum) {
        // Üçüncü fonksiyon, satır numarasını alıyor ve sonuçları döndürüyor

        // Sütun harflerini tutmak için bir dizi oluştur
        const charRange = [];

        // Başlangıç ve bitiş harflerinin Unicode (ASCII) değerlerini al
        const startCode = startChar.charCodeAt(0);
        const endCode = endChar.charCodeAt(0);

        // Başlangıçtan bitişe kadar olan harfleri charRange dizisine ekle
        for (let c = startCode; c <= endCode; c++) {
          const columnLetter = String.fromCharCode(c);
          charRange.push(columnLetter);
        }

        // Belirtilen satırdaki her bir sütun hücresinin değerini al
        const result = charRange.map(function(columnLetter) {
          // Hücre değerini getCellValueInRow fonksiyonu ile al
          const getValueFromRow = getCellValueInRow(rowNum);
          const cellValue = getValueFromRow(columnLetter);

          return cellValue;
        });

        // Tüm değerleri içeren dizi döndürülür
        return result;
      };
    };
  };


  // Hücre aralıklarını (örneğin: A1:B2) genişlet ve hücre değerleriyle değiştir
  const formulaWithExpandedRanges = formula.replace(
    rangeRegex,
    (_match, startCol, startRow, endCol, endRow) => {
      const rowRange = rangeFromString(startRow, endRow);
      const expandedValues = rowRange.flatMap(
        expandColumnRange(startCol)(endCol)
      );
      return expandedValues.join(",");
    }
  );

  // Tek tek hücreleri (örneğin: A1, B2) yakalayan regex
  const cellRegex = /[A-J][1-9][0-9]?/gi;

  // Tüm hücre ID'lerini, içerdiği değerle değiştir
  const formulaWithCellValues = formulaWithExpandedRanges.replace(
    // cellRegex: Formül içindeki hücre referanslarını eşleştiren düzenli ifade (örnek: A1, B2, C10 vs.)
    cellRegex,

    // Her bir eşleşen hücre referansı için çalışacak fonksiyon
    function(match) {
      // Hücre adını büyük harfe çevir (örneğin "a1" → "A1")
      const cellId = match.toUpperCase();

      // Hücre değerini almak için getValueById fonksiyonunu çağır
      const value = getValueById(cellId);

      // Bu değeri formülde eski hücre referansının yerine koy
      return value;
    }
  );


  // applyFunction adında harici bir fonksiyon kullanılarak formüldeki fonksiyonlar uygulanır
  const evaluatedFormula = applyFunction(formulaWithCellValues);

  // Formül değişmemişse sonucu döndür, aksi takdirde işlemi tekrarla (recursion)
  if (evaluatedFormula === formula) {
    return evaluatedFormula;
  } else {
    return evalFormula(evaluatedFormula, cells);
  }
};


window.onload = function() {
  // Sayfa yüklendiğinde çalışacak fonksiyon

  // 1. Hücreleri ve etiketleri ekleyeceğimiz ana container
  const container = document.getElementById("container");

  // 2. Etiket (label) oluşturmak için yardımcı fonksiyon
  function createLabel(name) {
    const label = document.createElement("div"); // Yeni bir <div> oluştur
    label.className = "label";                  // "label" CSS sınıfı ekle
    label.textContent = name;                   // Etiketin içeriğini ayarla
    container.appendChild(label);               // container içine ekle
  }

  // 3. Sütun harflerini al: "A"dan "J"ye kadar
  const letters = charRange("A", "J");

  // 4. Sütun başlıklarını oluştur (örneğin: A, B, C, ..., J)
  for (let i = 0; i < letters.length; i++) {
    createLabel(letters[i]);
  }

  // 5. Satırları oluştur: 1'den 98'e kadar
  const rowNumbers = range(1, 99); // [1, 2, ..., 98]

  for (let i = 0; i < rowNumbers.length; i++) {
    const number = rowNumbers[i];

    // 5.1. Satır numarası etiketi oluştur
    createLabel(number);

    // 5.2. Bu satır için her sütun harfi için input oluştur
    for (let j = 0; j < letters.length; j++) {
      const letter = letters[j];

      // Hücre input'u oluştur
      const input = document.createElement("input");
      input.type = "text";
      input.id = letter + number;            // Örn: "A1", "B5"
      input.ariaLabel = letter + number;     // Erişilebilirlik için
      input.onchange = update;               // Değer değiştiğinde `update` fonksiyonu çağrılır

      // input'u container'a ekle
      container.appendChild(input);
    }
  }
};


const update = function(event) {
  // 1. Etkileşime girilen HTML elemanını al (örneğin bir <input>)
  const element = event.target;

  // 2. Elemanın içindeki değeri al ve tüm boşlukları kaldır
  // Örneğin: " = A1 + B2 " → "=A1+B2"
  const rawValue = element.value;
  const valueWithoutSpaces = rawValue.replace(/\s/g, "");

  // 3. Değer bir formül mü? Şu iki koşul kontrol edilir:
  // - Hücre kendi ID'sine referans vermemeli (sonsuz döngüyü önlemek için)
  // - Değer '=' ile başlamalı, yani bir formül olmalı
  const isSelfReferencing = valueWithoutSpaces.includes(element.id);
  const isFormula = valueWithoutSpaces.startsWith("=");

  if (!isSelfReferencing && isFormula) {
    // 4. '=' işaretinden sonraki kısmı al (örnek: "=A1+B2" → "A1+B2")
    const formulaString = valueWithoutSpaces.slice(1);

    // 5. Formülü hesaplamak için kullanılan yardımcı fonksiyonu çağır
    //    ve sonucu hesapla. İkinci parametre olarak tüm hücreleri veririz.
    const container = document.getElementById("container");
    const allCells = Array.from(container.children); // Tüm hücre DOM elemanları

    const evaluatedResult = evalFormula(formulaString, allCells);

    // 6. Hesaplanan sonucu input alanına geri yaz
    element.value = evaluatedResult;
  }
};
