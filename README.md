# WebP2_Hausuebung_2
by Laurin Sawellion


## How to use setup for development

```
npm install
```


## Allgemein und How to use

Die IDs werden nun vom Server über das UUID Packe UUID für die einzelnen Nutzer erstellt, da durch ein einzelnes Hochzählen der Useranzahl im Array sich IDs doppeln können, wenn zwischendurch auch wieder nutzer gelöscht werden udn dann weitere hinzugefügt werden. Das wird durch das nutzen der UUIDs veränder.

Das hat allerdings zur Folge, dass einige Funktionen umgebaut werden mussten, da die IDs nun keine Numbers sondern Strings sind.

Die severhttp-test.http sollte alle notwendigen Test für die Crud und Crd funktionen enthalten udn wurde auf die erstellten User Demodaten angepasst.
Die gesamte Anwendung funktioniert auch schon über des Webfrontend und kann theoretisch auch darüber noch zusätzlich getestet werden. Dort ist auch ein Button um schnell einfache Random User zu erstellen


Start NodeJS Server with
`npm start` 
or 
`node server.js`

Der Server läuft auf 
http://localhost:3001 
wenn keine andere Konfiguration vorgenommen wird



## Attention

When using `npm run build` there can be an error with the linked Bootstrap Icon font.
Try to not use it in first place, till its fixed