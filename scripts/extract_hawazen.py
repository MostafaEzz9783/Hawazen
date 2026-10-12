import json, openpyxl
from pathlib import Path
source=Path(r'C:/Users/Huawei/Downloads/Financial Study- Hawazen .xlsx')
values=openpyxl.load_workbook(source,data_only=True)
formulas=openpyxl.load_workbook(source,data_only=False)
def model(sheet,units,revenues,occupancy,fees):
    s=values[sheet]
    return dict(source=sheet,units=units,revenues={k:s[c].value for k,c in revenues.items() if isinstance(s[c].value,(int,float))},occupancy=occupancy,fees=fees)
models={
 'str':model('STR-Regular Study Summary',17,{'base':'F10'},[60,65,70],[dict(key='otaFee',rate=.15),dict(key='operator',rate=.21)]),
}
sheets=[]
for s in values:
 if s.sheet_state!='visible' or s.title not in ['FactSheet','STR-Studio-Master-Data','STR-Regular Financial Study','STR-Regular Study Summary']:continue
 cells=[]
 for row in formulas[s.title]:
  for c in row:
   if c.value is None:continue
   v=s[c.coordinate].value
   formula=(c.value if isinstance(c.value,str) else getattr(c.value,'text',None)) if c.data_type=='f' else None
   cells.append(dict(address=c.coordinate,value=v,formula=formula,error=s[c.coordinate].data_type=='e'))
 sheets.append(dict(name=s.title,cells=cells))
Path('src/data/hawazen.json').write_text(json.dumps(dict(models=models,sheets=sheets),ensure_ascii=False,default=str),encoding='utf-8')
for k,m in models.items():
 for scenario,revenue in m['revenues'].items():
  assert revenue>0
  if k=='str':assert abs(revenue*.7*.85*.79-values[m['source']]['H15'].value)<.01
print('Extracted visible STR sheets only; STR net reconciles to source.')
