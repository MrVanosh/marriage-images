#!/bin/bash

# Exit on error
set -e

echo "Deploying Marriage Images App to Kubernetes..."

# Apply namespace first
echo "Creating namespace..."
kubectl apply -f namespace.yaml

# Apply config and secrets
echo "Applying configuration..."
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Deploy the application
echo "Deploying application..."
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml

echo "Deployment complete!"
echo ""
echo "To check deployment status:"
echo "  kubectl get pods -n marriage-images"
echo ""
echo "To check logs:"
echo "  kubectl logs -f deployment/marriage-images -n marriage-images"
echo ""
echo "To scale deployment:"
echo "  kubectl scale deployment marriage-images --replicas=5 -n marriage-images"