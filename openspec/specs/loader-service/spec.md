### Requirement: Contador de peticiones activas
El servicio `LoaderService` SHALL mantener un contador interno de peticiones HTTP activas, expuesto como `Signal<boolean>` mediante la propiedad `isLoading`. El contador MUST inicializarse a 0 y MUST nunca ser negativo.

#### Scenario: Incremento al iniciar una petición
- **WHEN** se llama a `show()`
- **THEN** el contador interno se incrementa en 1

#### Scenario: Decremento al finalizar una petición
- **WHEN** se llama a `hide()` y el contador es mayor que 0
- **THEN** el contador interno se decrementa en 1

#### Scenario: Guardia contra contador negativo
- **WHEN** se llama a `hide()` y el contador ya es 0
- **THEN** el contador permanece en 0 y no se produce ningún error

### Requirement: Signal isLoading reactivo
El servicio SHALL exponer una propiedad `isLoading` de tipo `Signal<boolean>` (o `computed`) que refleje si el contador es mayor que 0.

#### Scenario: isLoading true con peticiones activas
- **WHEN** el contador es mayor que 0
- **THEN** `isLoading()` retorna `true`

#### Scenario: isLoading false sin peticiones activas
- **WHEN** el contador es 0
- **THEN** `isLoading()` retorna `false`

#### Scenario: isLoading vuelve a false al finalizar todas las peticiones
- **WHEN** hay 3 peticiones activas y las 3 llaman a `hide()`
- **THEN** `isLoading()` retorna `false` solo después de la tercera llamada a `hide()`

### Requirement: Singleton providedIn root
El servicio SHALL declararse con `providedIn: 'root'` para garantizar una única instancia en toda la aplicación.

#### Scenario: Una única instancia compartida
- **WHEN** dos componentes distintos inyectan `LoaderService`
- **THEN** ambos acceden al mismo contador e `isLoading` signal
