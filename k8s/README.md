# Marriage Images App - Kubernetes Deployment

This directory contains all the necessary files to deploy the Marriage Images app to a Kubernetes cluster in production.

## Prerequisites

- Kubernetes cluster (1.24+)
- kubectl configured to access your cluster
- Docker registry to store your images
- MariaDB server at 192.168.42.100
- Cloudflare R2 account for image storage

## Files Overview

- `namespace.yaml` - Creates the marriage-images namespace
- `configmap.yaml` - Non-sensitive configuration
- `secret.yaml` - Sensitive credentials (update before deploying!)
- `deployment.yaml` - Main application deployment
- `service.yaml` - ClusterIP service for the app
- `ingress.yaml` - Ingress for external access with TLS
- `deploy.sh` - Deployment script

## Deployment Steps

### 1. Build and Push Docker Image

```bash
# Build the Docker image
docker build -t your-registry/marriage-images:latest .

# Push to your registry
docker push your-registry/marriage-images:latest
```

### 2. Update Configuration

1. Edit `secret.yaml` and update:
   - R2_ACCOUNT_ID
   - R2_ACCESS_KEY_ID
   - R2_SECRET_ACCESS_KEY
   - DATABASE_URL (already set for your MariaDB)

2. Edit `configmap.yaml` and update:
   - R2_PUBLIC_URL
   - NEXT_PUBLIC_APP_URL

3. Edit `deployment.yaml` and update:
   - `image: your-registry/marriage-images:latest` with your actual registry

4. Edit `ingress.yaml` and update:
   - Replace `your-domain.com` with your actual domain

### 3. Deploy to Kubernetes

```bash
cd k8s
./deploy.sh
```

Or manually:

```bash
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

### 4. Verify Deployment

```bash
# Check pods
kubectl get pods -n marriage-images

# Check services
kubectl get svc -n marriage-images

# Check ingress
kubectl get ingress -n marriage-images

# View logs
kubectl logs -f deployment/marriage-images -n marriage-images
```

## Production Considerations

### 1. Persistent Storage

The current setup uses `emptyDir` for uploads, which is NOT persistent. For production, consider:
- Using Persistent Volumes for local uploads
- Or rely entirely on R2 for storage

### 2. Database Migrations

Run database migrations before deploying:
```bash
npm run db:migrate
```

### 3. Horizontal Pod Autoscaling

Add HPA for automatic scaling:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: marriage-images-hpa
  namespace: marriage-images
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: marriage-images
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### 4. SSL/TLS

The ingress is configured for TLS. Ensure you have:
- cert-manager installed for automatic Let's Encrypt certificates
- Or manually create the TLS secret

### 5. Monitoring

Consider adding:
- Prometheus metrics
- Grafana dashboards
- Log aggregation (ELK/Loki)

## Troubleshooting

### Pod not starting
```bash
kubectl describe pod <pod-name> -n marriage-images
```

### Database connection issues
- Ensure MariaDB is accessible from the cluster
- Check firewall rules
- Verify credentials

### Image upload failures
- Check R2 credentials
- Verify bucket permissions
- Check pod logs for errors

## Scaling

To scale the deployment:
```bash
kubectl scale deployment marriage-images --replicas=5 -n marriage-images
```

## Rollback

To rollback to a previous version:
```bash
kubectl rollout undo deployment/marriage-images -n marriage-images
```

## Cleanup

To remove everything:
```bash
kubectl delete namespace marriage-images
```
