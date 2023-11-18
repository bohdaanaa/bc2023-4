const http = require('http');
const fs = require('fs');
const fastXmlParser = require('fast-xml-parser');

const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
  const xmlData = fs.readFileSync('data.xml', 'utf-8');
  const parser = new fastXmlParser.XMLParser();
  const parsedData = parser.parse(xmlData);

  if (parsedData && parsedData.indicators && parsedData.indicators.banksincexp) {
    const selectedCategories = parsedData.indicators.banksincexp.filter(item =>
      item.txt === "Доходи, усього" || item.txt === "Витрати, усього"
    );

    const builder = new fastXmlParser.XMLBuilder({});

    const customXmlObj = {
      data: {
        indicators: selectedCategories.map(item => ({
          txt: item.txt,
          value: item.value
        }))
      }
    };

    const customXml = builder.build(customXmlObj);

    res.setHeader('Content-Type', 'application/xml');
    res.writeHead(200);
    res.end(customXml);
  }
});

server.listen(port,host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});