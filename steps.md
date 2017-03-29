### (semi-)manual steps in LibreOffice

* (indent 1.5 cm first line)
* undo highlighting

| text | what | with what |
| --- | --- | --- |
| examples | `11 bold (.+)` | `$1, style(fontcolor: pink)` |
| redundant spaces | `^ +` | `nothing` |
| - | `\t` | `nothing` |
| lemmata | `bold, 12pt (.+)` | `style(fontcolor: red)` |
| - | `\s+` | `SPACE` |
| - | `\s-\s` | `SPACE–SPACE` |
| dashes | `\s–\s` | `style(fontcolor: blue; bold)` |
| numbers, e.g. `1)` | `([0-9]+\))` | `$1, style(fontcolor: orange; bold)` |
| localities | `(\([А-ЯЁ][а-яё]+?\))`, register! | `$1, style(fontcolor: purple)` |
| styles | `\b(бран\.)|\b(груб\.)|\b(вульг\.)|\b(ирон\.)|\b(перен\.)|\b(пренебр\.)|\b(прост\.)|\b(реч\. ош\.)|\b(собир\.)|\b(спец\.)|\b(шутл\.)|\b(уст\.)|\b(экспресс\.)|\b(уменьш\.)` | `$0, style(fontcolor: sky blue)` |
| references | `\b(см\.)|\b(также – )|\b(ср\.)` | `$0, style(fontcolor: orange 1)` |
| inflection | `\b(сов\.)|\b(несов\.)|\b(мн\.)|\b(множ\.)|\b(ед\.)|\b(многокр\.)|\b(однокр\.)\b(сравн\.степ\.)` | `$0, style(fontcolor: yellow 3)` |
| Q | `Q` | `Q, style(fontcolor: green 3; 11, bold)` |
