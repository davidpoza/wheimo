## ADDED Requirements

### Requirement: Gráfico de evolución de saldo por cuenta
El frontend SHALL mostrar un gráfico de línea (PrimeNG `<p-chart type="line">`) con la evolución del saldo a lo largo del tiempo para la cuenta seleccionada. Los datos provienen del campo `balance` de las transacciones ordenadas por fecha.

#### Scenario: Visualización de evolución de saldo
- **WHEN** el usuario navega a la vista de gráficos y selecciona una cuenta
- **THEN** el componente muestra un gráfico de línea con el eje X = fecha y el eje Y = saldo, usando los datos de transacciones de esa cuenta

#### Scenario: Cuenta sin transacciones
- **WHEN** la cuenta seleccionada no tiene transacciones
- **THEN** el gráfico muestra un estado vacío con mensaje informativo

### Requirement: Gráfico de gastos por etiqueta (pie/bar)
El frontend SHALL mostrar un gráfico de tipo pie o bar (PrimeNG `<p-chart>`) con el desglose de gastos por etiqueta para un periodo seleccionado. Los datos provienen del endpoint GET /api/transactions/tags.

#### Scenario: Visualización de gastos por etiqueta
- **WHEN** el usuario selecciona un rango de fechas en la vista de gráficos
- **THEN** el componente muestra el total de gasto por etiqueta, con etiqueta "sin etiquetar" para transacciones sin tag

#### Scenario: Selector de periodo
- **WHEN** el usuario cambia el rango de fechas (mes, año, personalizado)
- **THEN** el gráfico se actualiza automáticamente con los datos del nuevo periodo

### Requirement: Heatmap de gastos diarios
El frontend SHALL mostrar un heatmap visual donde cada celda representa un día y su intensidad de color indica el importe de gasto. Los datos provienen del endpoint GET /api/transactions/calendar?groupBy=day. El heatmap SHALL excluir la etiqueta ignorada del usuario.

#### Scenario: Visualización del heatmap anual
- **WHEN** el usuario navega a la vista de heatmap para un año concreto
- **THEN** el frontend carga los datos del calendario anual y renderiza el heatmap con celdas coloreadas según el gasto diario

#### Scenario: Tooltip en celda del heatmap
- **WHEN** el usuario pasa el cursor sobre una celda del heatmap
- **THEN** se muestra un tooltip con la fecha y el importe total de gasto de ese día

#### Scenario: Selección de año
- **WHEN** el usuario cambia el año con el selector
- **THEN** el heatmap se actualiza con los datos del año seleccionado

### Requirement: Estadísticas resumidas
El frontend SHALL mostrar un panel de estadísticas calculadas por el backend (endpoint GET /api/transactions/statistics): día más caro, día menos caro, mes más caro, mes menos caro, total de gastos, racha más larga sin gastos (start, end, días).

#### Scenario: Panel de estadísticas
- **WHEN** el usuario visualiza la vista de heatmap
- **THEN** el panel lateral muestra todas las estadísticas del periodo seleccionado con formato legible (fechas formateadas, importes con 2 decimales y símbolo de moneda)

### Requirement: Gráfico de totales por etiqueta a lo largo del tiempo
El frontend SHALL mostrar un gráfico de barras (PrimeNG `<p-chart type="bar">`) con los totales de gasto/ingreso agrupados por día o mes para una o varias etiquetas seleccionadas.

#### Scenario: Gráfico de barras por etiqueta
- **WHEN** el usuario selecciona una etiqueta y un periodo en la vista de gráficos
- **THEN** el gráfico de barras muestra el total de gasto o ingreso agrupado por el periodo seleccionado

#### Scenario: Cambiar agrupación día/mes
- **WHEN** el usuario cambia el selector de agrupación entre "día" y "mes"
- **THEN** el gráfico se actualiza usando el endpoint con el `groupBy` correspondiente

### Requirement: Gráfico de ahorro (piggybank/wallet)
El frontend SHALL mostrar un gráfico de progreso de ahorro para cuentas de tipo `piggybank` con `savingTargetAmount` definido, mostrando el progreso hacia el objetivo.

#### Scenario: Visualización de progreso de ahorro
- **WHEN** el usuario visualiza una cuenta de ahorro con objetivo definido
- **THEN** el componente muestra el saldo actual, el objetivo, la fecha objetivo y un indicador de progreso (porcentaje)

### Requirement: Diseño responsive
Todas las vistas del frontend SHALL ser responsive y funcionar correctamente en dispositivos móviles (min-width: 320px) y de escritorio. Se SHALL usar el grid responsive de PrimeNG y CSS Grid/Flexbox.

#### Scenario: Vista en móvil
- **WHEN** el usuario accede desde un dispositivo con ancho < 768px
- **THEN** los menús colapsables SHALL mostrarse como drawer, las tablas SHALL mostrar vista compacta o scroll horizontal, y los gráficos SHALL adaptarse al ancho disponible

#### Scenario: Vista en escritorio
- **WHEN** el usuario accede desde dispositivo con ancho >= 1024px
- **THEN** la navegación SHALL mostrarse como sidebar lateral y los gráficos SHALL utilizar el espacio disponible completo
